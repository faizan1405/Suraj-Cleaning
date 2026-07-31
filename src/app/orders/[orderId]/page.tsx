import { getOrderById } from "@/data/orders";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/currency";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: "bg-green-100", text: "text-green-700" },
  payment_pending: { bg: "bg-amber-100", text: "text-amber-700" },
  paid: { bg: "bg-blue-100", text: "text-blue-700" },
  processing: { bg: "bg-indigo-100", text: "text-indigo-700" },
  shipped: { bg: "bg-purple-100", text: "text-purple-700" },
  delivered: { bg: "bg-green-100", text: "text-green-700" },
  cancelled: { bg: "bg-red-100", text: "text-red-700" },
  refunded: { bg: "bg-slate-100", text: "text-slate-700" },
};

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const session = await getSession();
  const order = await getOrderById(orderId);

  // Authorization: require login
  if (!session) {
    redirect("/signin");
  }

  if (!order) {
    return (
      <section className="py-[72px] md:py-[88px] bg-white">
        <div className="mx-auto max-w-[500px] px-5 md:px-8 text-center py-12">
          <h1 className="text-[24px] font-bold text-[#0f172a] mb-2">Order Not Found</h1>
          <p className="text-[14px] text-[#64748b] mb-6">No order exists with ID {orderId}.</p>
          <a href="/orders" className="inline-flex items-center gap-2 text-[#2563eb] font-semibold text-[15px]">View All Orders</a>
        </div>
      </section>
    );
  }

  // Verify ownership by userId or email
  const ownsByUserId = (order as any).userId === session.sub;
  const ownsByEmail = order.customer.email.toLowerCase() === session.email.toLowerCase();
  if (!ownsByUserId && !ownsByEmail) {
    return (
      <section className="py-[72px] md:py-[88px] bg-white">
        <div className="mx-auto max-w-[500px] px-5 md:px-8 text-center py-12">
          <h1 className="text-[24px] font-bold text-[#0f172a] mb-2">Order Not Found</h1>
          <p className="text-[14px] text-[#64748b] mb-6">This order does not exist or you don't have permission to view it.</p>
          <a href="/orders" className="inline-flex items-center gap-2 text-[#2563eb] font-semibold text-[15px]">View All Orders</a>
        </div>
      </section>
    );
  }

  const colors = STATUS_COLORS[order.status] || { bg: "bg-slate-100", text: "text-slate-600" };

  return (
    <section className="py-[72px] md:py-[88px] bg-white">
      <div className="mx-auto max-w-[800px] px-5 md:px-8">
        <div className="mb-6">
          <a href="/orders" className="inline-flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#2563eb] transition-colors">
            &larr; Back to Orders
          </a>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[24px] font-bold text-[#0f172a] mb-1">{order.id}</h1>
            <p className="text-[13px] text-[#64748b]">Placed on {new Date(order.createdAt).toLocaleString("en-IN")}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-[12px] font-bold ${
              order.paymentMethod === "cod"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}>
              {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-[12px] font-bold ${colors.bg} ${colors.text}`}>
              {order.status.replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-[16px] font-bold text-[#0f172a]">Items</h2>
            {order.items.map((item) => (
              <div key={item.productId} className="flex gap-4 p-4 bg-[#f8fafc] rounded-2xl border border-slate-200/80">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-100 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-[#0f172a]">{item.name}</p>
                  {item.size && <p className="text-[12px] text-[#64748b]">Size: {item.size}</p>}
                  <p className="text-[12px] text-[#64748b]">Qty: {item.quantity} x {formatPrice(item.price)}</p>
                </div>
                <p className="text-[14px] font-bold text-[#0f172a]">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-[#f8fafc] rounded-2xl p-5 border border-slate-200/80">
              <h3 className="text-[14px] font-bold text-[#0f172a] mb-3">Delivery Address</h3>
              <p className="text-[13px] text-slate-600">{order.customer.fullName}</p>
              <p className="text-[13px] text-slate-600">{order.customer.address}</p>
              {order.customer.landmark && <p className="text-[13px] text-slate-600">{order.customer.landmark}</p>}
              <p className="text-[13px] text-slate-600">{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
              <p className="text-[13px] text-slate-600 mt-2">{"📞"} {order.customer.mobile}</p>
            </div>

            <div className="bg-[#f8fafc] rounded-2xl p-5 border border-slate-200/80">
              <h3 className="text-[14px] font-bold text-[#0f172a] mb-3">Payment</h3>
              <p className="text-[13px] text-slate-600">Method: <span className="font-medium">
                {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment (Razorpay)"}
              </span></p>
              <p className="text-[13px] text-slate-600">Status: <span className="font-medium">{order.paymentStatus}</span></p>
              {order.razorpayOrderId && <p className="text-[12px] text-slate-400 mt-1">Razorpay Order: {order.razorpayOrderId}</p>}
              {order.razorpayPaymentId && <p className="text-[12px] text-slate-400 mt-0.5">Payment ID: {order.razorpayPaymentId}</p>}
              {order.paidAt && <p className="text-[12px] text-slate-400 mt-0.5">Paid At: {new Date(order.paidAt).toLocaleString("en-IN")}</p>}
            </div>

            <div className="bg-[#f8fafc] rounded-2xl p-5 border border-slate-200/80">
              <h3 className="text-[14px] font-bold text-[#0f172a] mb-3">Summary</h3>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[13px]"><span className="text-[#64748b]">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                <div className="flex justify-between text-[13px]"><span className="text-[#64748b]">Delivery</span><span>{order.deliveryCharge === 0 ? "FREE" : formatPrice(order.deliveryCharge)}</span></div>
                <div className="flex justify-between text-[13px]"><span className="text-[#64748b]">Tax</span><span>{formatPrice(order.taxAmount)}</span></div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-[15px]"><span>Total</span><span className="text-[#2563eb]">{formatPrice(order.total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}