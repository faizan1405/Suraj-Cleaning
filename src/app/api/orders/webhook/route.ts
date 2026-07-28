export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { getOrderByRazorpayPaymentId, getOrderByRazorpayOrderId, updateOrder } from "@/data/orders";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature") ?? "";

    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
    }

    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const payment = event?.payload?.payment?.entity ?? {};
    const razorpayOrderId: string = payment.order_id;
    const razorpayPaymentId: string = payment.id;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json({ received: true, note: "Ignoring non-payment event" });
    }

    // Idempotency
    const existing = await getOrderByRazorpayPaymentId(razorpayPaymentId);
    if (existing && existing.paymentStatus === "paid") {
      return NextResponse.json({ received: true, idempotent: true });
    }

    const order = await getOrderByRazorpayOrderId(razorpayOrderId);
    if (!order) {
      return NextResponse.json({ received: true, note: "Order not found" });
    }

    const eventType: string = event.event ?? "";

    if (eventType === "payment.captured" || eventType === "order.paid") {
      await updateOrder(order.id, {
        razorpayPaymentId,
        paymentStatus: "paid",
        status: "processing",
        paidAt: new Date().toISOString(),
      });
    } else if (eventType === "payment.failed") {
      await updateOrder(order.id, {
        paymentStatus: "failed",
        status: "cancelled",
      });
    } else if (eventType === "refund.processed") {
      await updateOrder(order.id, {
        paymentStatus: "refunded",
        status: "refunded",
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
