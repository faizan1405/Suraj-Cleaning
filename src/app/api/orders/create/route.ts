export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { checkoutSchema } from "@/lib/order-schema";
import { createRazorpayOrder, getRazorpayKeyId, isRazorpayServerConfigured } from "@/lib/razorpay";
import { getProducts } from "@/data/products";
import { createOrder } from "@/data/orders";
import type { Order, OrderItem } from "@/data/orders";
import logger from "@/lib/logger";

interface CartItemInput {
  productId: string;
  quantity: number;
  size?: string;
}

const DELIVERY_FEE = 49;
const FREE_DELIVERY_THRESHOLD = 499;
const TAX_PERCENT = 0;
const TAX_LABEL = "GST";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paymentMethod = body.paymentMethod === "cod" ? "cod" : "razorpay";

    if (paymentMethod === "razorpay" && !isRazorpayServerConfigured()) {
      return NextResponse.json(
        { error: "Online payment is not configured. Please select Cash on Delivery or contact support." },
        { status: 503 }
      );
    }

    const customer = checkoutSchema.parse(body.customer);
    const cartInput: CartItemInput[] = Array.isArray(body.items) ? body.items : [];

    if (cartInput.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const allProducts = await getProducts();
    const productMap = new Map(allProducts.map((p) => [p.id, p]));

    const items: OrderItem[] = [];
    const unavailable: string[] = [];
    const stockIssues: { productId: string; name: string; available: number; requested: number }[] = [];

    for (const ci of cartInput) {
      const product = productMap.get(ci.productId);
      if (!product) {
        unavailable.push(ci.productId);
        continue;
      }
      if (!product.active) {
        unavailable.push(ci.productId);
        continue;
      }

      let itemPrice: number;
      let itemStock: number;

      if (ci.size && Array.isArray(product.variants) && product.variants.length > 0) {
        const variant = product.variants.find((v: any) => v.name === ci.size);
        if (variant) {
          itemPrice = typeof variant.price === "number" ? variant.price : Number(variant.price) || product.price;
          itemStock = typeof variant.stock === "number" ? variant.stock : Number(variant.stock) || 0;
        } else {
          itemPrice = product.price;
          itemStock = Number(product.stock ?? 0);
        }
      } else {
        itemPrice = product.price;
        itemStock = Number(product.stock ?? 0);
      }

      if (itemStock < ci.quantity || ci.quantity < 1) {
        stockIssues.push({ productId: ci.productId, name: product.name, available: itemStock, requested: ci.quantity });
        continue;
      }
      items.push({
        productId: ci.productId,
        name: product.name,
        price: itemPrice,
        quantity: ci.quantity,
        image: product.image,
        size: ci.size,
        subtotal: itemPrice * ci.quantity,
      });
    }

    if (unavailable.length > 0) {
      return NextResponse.json({ error: "Some items are no longer available", unavailable }, { status: 409 });
    }
    if (stockIssues.length > 0) {
      return NextResponse.json({ error: "Insufficient stock for some items", stockIssues }, { status: 409 });
    }

    const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
    const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const taxAmount = Math.round((subtotal * TAX_PERCENT) / 100);
    const total = subtotal + deliveryCharge + taxAmount;

    let razorpayOrderId = "";

    if (paymentMethod === "razorpay") {
      const razorpay = await createRazorpayOrder({
        amount: total,
        notes: {
          customer_email: customer.email,
          customer_mobile: customer.mobile,
        },
      });
      razorpayOrderId = razorpay.id;
    }

    const now = new Date().toISOString();
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    // Attach userId if logged in so future My Account lookups work
    const session = await getSession();

    const order: Order = {
      id: orderId,
      userId: session?.sub,
      razorpayOrderId,
      paymentMethod,
      paymentStatus: "pending",
      status: paymentMethod === "cod" ? "confirmed" : "payment_pending",
      items,
      customer,
      subtotal,
      deliveryCharge,
      taxAmount,
      total,
      createdAt: now,
      updatedAt: now,
    };

    await createOrder(order);

    // For COD, reduce stock immediately since the order is confirmed
    if (paymentMethod === "cod") {
      await reduceStock(items);
    }

    if (paymentMethod === "cod") {
      return NextResponse.json({
        orderId: order.id,
        paymentMethod: "cod",
        status: order.status,
        total: order.total,
        currency: "INR",
      });
    }

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId,
      amount: total,
      currency: "INR",
      keyId: getRazorpayKeyId(),
      taxLabel: TAX_LABEL,
    });
  } catch (error) {
    logger.error("Order creation failed", { error: error instanceof Error ? error.message : "Unknown error" });
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function reduceStock(items: OrderItem[]) {
  try {
    const { readJsonFile, writeJsonFile } = await import("@/lib/db");
    const raw = await readJsonFile<Record<string, unknown>[]>("products.json");
    if (!Array.isArray(raw)) return;

    const itemsById = new Map(items.map((i) => [i.productId, i.quantity]));
    const updated = raw.map((p) => {
      const id = String(p.id ?? "");
      if (itemsById.has(id)) {
        const currentStock = Number(p.stock ?? 0);
        return { ...p, stock: Math.max(0, currentStock - (itemsById.get(id) ?? 0)) };
      }
      return p;
    });
    await writeJsonFile("products.json", updated);
  } catch (err) {
    console.error("Failed to reduce stock:", err);
  }
}
