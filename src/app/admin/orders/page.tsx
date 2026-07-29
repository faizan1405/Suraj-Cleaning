"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Eye, X, Package } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminUI";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  subtotal: number;
}

interface Order {
  _id?: string;
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  paymentMethod?: string;
  paymentStatus: string;
  status: string;
  items: OrderItem[];
  customer: {
    fullName: string;
    mobile: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    orderNotes?: string;
  };
  subtotal: number;
  deliveryCharge: number;
  taxAmount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

const STATUS_OPTIONS = [
  "all", "confirmed", "payment_pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded",
] as const;

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  payment_pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-slate-100 text-slate-700",
};

const PAYMENT_METHOD_COLORS: Record<string, string> = {
  cod: "bg-green-100 text-green-700",
  razorpay: "bg-blue-100 text-blue-700",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-slate-100 text-slate-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data/orders", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    return orders
      .filter((o) => statusFilter === "all" || o.status === statusFilter)
      .filter((o) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return o.id.toLowerCase().includes(q) || o.customer.fullName.toLowerCase().includes(q) || o.customer.email.toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, statusFilter, search]);

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch("/api/admin/data/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, data: { status: newStatus } }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      if (selectedOrder?.id === id) setSelectedOrder(updated);
    }
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Manage customer orders, payments, and fulfillment."
      />

      <div className="ad-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, customer name, or email"
              className="admin-input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as (typeof STATUS_OPTIONS)[number])}
            className="admin-select"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All statuses" : s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="ad-card">
          <div className="p-10 flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-[14px] text-slate-500">Loading orders...</span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="ad-card">
          <div className="p-16 text-center">
            <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-[14px] text-slate-500 font-medium">No orders found.</p>
          </div>
        </div>
      ) : (
        <div className="ad-card overflow-hidden">
          <div className="admin-table-wrap">
            <table className="w-full text-left admin-table">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Items</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Payment</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pay Status</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 text-[12px] font-mono font-bold text-slate-700">{order.id}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-semibold text-slate-700">{order.customer.fullName}</p>
                      <p className="text-[11px] text-slate-500">{order.customer.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-slate-600">{order.items.reduce((s, i) => s + i.quantity, 0)}</td>
                    <td className="px-5 py-3.5 text-[13px] font-bold text-slate-700">{order.total.toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_COLORS[order.status] || "bg-slate-100 text-slate-600"}`}>
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${PAYMENT_METHOD_COLORS[order.paymentMethod || "razorpay"] || "bg-slate-100 text-slate-600"}`}>
                        {order.paymentMethod === "cod" ? "COD" : "Online"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${PAYMENT_STATUS_COLORS[order.paymentStatus] || "bg-slate-100 text-slate-600"}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-slate-500">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setSelectedOrder(order)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" aria-label="View order">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200/80">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between z-10">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Order Details</p>
                <p className="text-[16px] font-bold text-slate-900 font-mono">{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Customer</p>
                  <p className="text-[13px] font-medium text-slate-700">{selectedOrder.customer.fullName}</p>
                  <p className="text-[12px] text-slate-500">{selectedOrder.customer.email}</p>
                  <p className="text-[12px] text-slate-500">{selectedOrder.customer.mobile}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Address</p>
                  <p className="text-[12px] text-slate-600">{selectedOrder.customer.address}</p>
                  <p className="text-[12px] text-slate-600">{selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Items</p>
                {selectedOrder.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg border border-slate-100 object-contain p-1" />
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-slate-700">{item.name}</p>
                      <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[13px] font-bold">{item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Payment</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${PAYMENT_METHOD_COLORS[selectedOrder.paymentMethod || "razorpay"] || "bg-slate-100 text-slate-600"}`}>
                    {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${PAYMENT_STATUS_COLORS[selectedOrder.paymentStatus] || "bg-slate-100 text-slate-600"}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                {selectedOrder.razorpayOrderId && <p className="text-[11px] text-slate-400 mt-1">Razorpay Order ID: <span className="font-mono">{selectedOrder.razorpayOrderId}</span></p>}
                {selectedOrder.razorpayPaymentId && <p className="text-[11px] text-slate-400 mt-0.5">Payment ID: <span className="font-mono">{selectedOrder.razorpayPaymentId}</span></p>}
                {selectedOrder.paidAt && <p className="text-[11px] text-slate-400 mt-0.5">Paid At: {new Date(selectedOrder.paidAt).toLocaleString("en-IN")}</p>}
                <p className="text-[13px] text-slate-700 mt-2">Total: <span className="font-bold text-[#2563eb]">{selectedOrder.total.toFixed(2)}</span></p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Update Order Status</p>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                  className="admin-select"
                >
                  {STATUS_OPTIONS.filter((s) => s !== "all").map((s) => (
                    <option key={s} value={s}>{s.replace("_", " ")}</option>
                  ))}
                </select>
              </div>

              {selectedOrder.paymentMethod === "cod" && (
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Update Payment Status (COD)</p>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={async (e) => {
                      const newPaymentStatus = e.target.value;
                      const res = await fetch("/api/admin/data/orders", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: selectedOrder.id, data: { paymentStatus: newPaymentStatus } }),
                      });
                      if (res.ok) {
                        const updated = await res.json();
                        setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? updated : o)));
                        setSelectedOrder(updated);
                      }
                    }}
                    className="admin-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">Mark as "Paid" when cash is collected from the customer.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}