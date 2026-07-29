export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/order-schema";
import { createRazorpayOrder, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";
import { getProducts } from "@/data/products";
import { createOrder } from "@/data/orders";
import type { Order, OrderItem } from "@/data/orders";

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
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Payment is not configured. Please add Razorpay credentials to your .env file." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
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

      // Determine price and stock from variant if size is specified
      let itemPrice: number;
      let itemStock: number;

      if (ci.size && Array.isArray(product.variants) && product.variants.length > 0) {
        const variant = product.variants.find((v: any) => v.name === ci.size);
        if (variant) {
          itemPrice = typeof variant.price === "number" ? variant.price : Number(variant.price) || product.price;
          itemStock = typeof variant.stock === "number" ? variant.stock : Number(variant.stock) || 0;
        } else {
          // Variant name not found — fall back to product-level
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

    const razorpay = await createRazorpayOrder({
      amount: total,
      notes: {
        customer_email: customer.email,
        customer_mobile: customer.mobile,
      },
    });

    const now = new Date().toISOString();
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const order: Order = {
      id: orderId,
      razorpayOrderId: razorpay.id,
      paymentStatus: "pending",
      status: "payment_pending",
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

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpay.id,
      amount: razorpay.amount,
      currency: razorpay.currency,
      keyId: getRazorpayKeyId(),
      taxLabel: TAX_LABEL,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
