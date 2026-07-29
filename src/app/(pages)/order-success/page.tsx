import { getOrderById } from "@/data/orders";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const params = await searchParams;
  const orderId = params.orderId;
  const order = orderId ? await getOrderById(orderId) : null;

  return (
    <section className="py-[72px] md:py-[88px] bg-white">
      <div className="mx-auto max-w-[600px] px-5 md:px-8">
        <div className="text-center">
          {!order ? (
            <>
              <h1 className="text-[24px] font-bold text-[#0f172a] mb-2">Order Not Found</h1>
              <p className="text-[14px] text-[#64748b] mb-6">We couldn't find this order.</p>
              <Link href="/products" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2563eb] text-white font-bold text-[15px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200">Browse Products</Link>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[32px]">✓</span>
              </div>
              <h1 className="text-[24px] font-bold text-[#0f172a] mb-2">
                {order.paymentMethod === "cod" ? "Order Confirmed!" : "Payment Successful!"}
              </h1>
              <p className="text-[14px] text-[#64748b] mb-6">
                {order.paymentMethod === "cod"
                  ? `Thank you for your order, ${order.customer.fullName}. Pay cash when you receive your delivery.`
                  : `Thank you for your order, ${order.customer.fullName}.`}
              </p>

              <div className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-200/80 text-left mb-6">
                <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Order ID</p>
                <p className="text-[14px] font-mono font-bold text-[#2563eb] mb-4">{order.id}</p>
                <p className="text-[13px] text-slate-600 mb-1"><strong>Delivery:</strong> {order.customer.address}, {order.customer.city} - {order.customer.pincode}</p>
                <p className="text-[13px] text-slate-600 mb-3"><strong>Total:</strong> <span className="font-bold text-[#0f172a]">{formatPrice(order.total)}</span></p>
                <div className="border-t border-slate-200 pt-3">
                  <p className="text-[11px] text-slate-400 mb-2">Items:</p>
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between text-[12px] mb-1">
                      <span className="text-slate-600">{item.name} × {item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between text-[12px] mb-1">
                    <span className="text-slate-500">Payment Method</span>
                    <span className="font-medium text-slate-700">
                      {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-slate-500">Payment Status</span>
                    <span className={`font-medium ${
                      order.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"
                    }`}>
                      {order.paymentMethod === "cod" && order.paymentStatus === "pending"
                        ? "Pay on Delivery"
                        : order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/orders" className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white font-bold text-[14px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200">View My Orders</Link>
                <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-[#334155] font-bold text-[14px] rounded-full hover:bg-slate-200 transition-colors">Continue Shopping →</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
