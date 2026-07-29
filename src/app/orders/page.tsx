import { getOrdersByEmail } from "@/data/orders";
import type { Order } from "@/data/orders";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params.email?.trim() ?? "";

  let orders: Order[] = [];
  if (email) {
    orders = await getOrdersByEmail(email);
  }

  const statusColor: Record<string, string> = {
    confirmed: "bg-green-100 text-green-700",
    payment_pending: "bg-amber-100 text-amber-700",
    paid: "bg-blue-100 text-blue-700",
    processing: "bg-indigo-100 text-indigo-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-slate-100 text-slate-700",
  };

  return (
    <section className="py-[72px] md:py-[88px] bg-white">
      <div className="mx-auto max-w-[600px] px-5 md:px-8">
        <div className="mb-6">
          <a href="/" className="inline-flex items-center gap-1.5 text-[13px] text-[#64748b] hover:text-[#2563eb] transition-colors">
            ← Back to Home
          </a>
        </div>
        <h1 className="text-[28px] md:text-[34px] font-bold text-[#0f172a] mb-2">My Orders</h1>
        <p className="text-[14px] text-[#64748b] mb-6">Enter your email address to find your orders.</p>

        <form action={`/orders?email=`} method="GET" className="flex gap-2 mb-8">
          <input
            type="email"
            name="email"
            defaultValue={email}
            required
            placeholder="your@email.com"
            className="flex-1 px-4 py-2.5 text-[14px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] transition-all"
          />
          <button type="submit" className="px-5 py-2.5 bg-[#2563eb] text-white font-semibold text-[14px] rounded-xl hover:bg-[#1d4ed8] transition-colors">
            Search
          </button>
        </form>

        {email && orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[14px] text-[#64748b]">No orders found for this email.</p>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => (
              <a
                key={order.id}
                href={`/orders/${order.id}?email=${encodeURIComponent(order.customer.email)}`}
                className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-2xl border border-slate-200/80 hover:border-[#2563eb]/30 hover:shadow-md transition-all group"
              >
                <div>
                  <p className="text-[13px] font-bold text-[#0f172a]">{order.id}</p>
                  <p className="text-[12px] text-[#64748b]">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  <p className="text-[12px] text-[#64748b]">{order.items.reduce((s, i) => s + i.quantity, 0)} items · ₹{order.total.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    order.paymentMethod === "cod"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {order.paymentMethod === "cod" ? "COD" : "Online"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusColor[order.status] || "bg-slate-100 text-slate-600"}`}>
                    {order.status.replace("_", " ")}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
