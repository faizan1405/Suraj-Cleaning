import Razorpay from "razorpay";

let instance: Razorpay | null = null;

function getRazorpayInstance(): Razorpay {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are not configured");
  }
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return instance;
}

export async function createRazorpayOrder(options: {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}): Promise<{ id: string; amount: number; currency: string }> {
  const razorpay = getRazorpayInstance();
  const order = await razorpay.orders.create({
    amount: Math.round(options.amount * 100),
    currency: options.currency ?? "INR",
    receipt: options.receipt ?? `rcpt_${Date.now()}`,
    notes: options.notes ?? {},
  });
  const amountValue = typeof order.amount === "number" ? order.amount : Number(order.amount);
  return { id: order.id, amount: amountValue / 100, currency: order.currency };
}

export function getRazorpayKeyId(): string | undefined {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID;
}

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  const body = `${orderId}|${paymentId}`;
  const crypto = require("crypto");
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");
  return expected === signature;
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const crypto = require("crypto");
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");
  return expected === signature;
}
