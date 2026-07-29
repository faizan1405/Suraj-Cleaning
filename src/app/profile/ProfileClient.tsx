"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  MapPin,
  User,
  LogOut,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  MapPinned,
  Phone,
  Mail,
  ShoppingBag,
  RefreshCw,
  Menu,
} from "lucide-react";
import type { SessionUser } from "@/lib/auth";

interface Address {
  id: string;
  label: string;
  fullName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  phone?: string;
  addresses: Address[];
  defaultAddressId?: string;
}

interface Order {
  _id?: string;
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  items: { productId: string; name: string; price: number; quantity: number; image: string; size?: string; subtotal: number }[];
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

type Tab = "dashboard" | "orders" | "addresses" | "profile";

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "profile", label: "Profile", icon: User },
];

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

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function ProfileClient({ initialUser, initialProfile }: { initialUser: SessionUser; initialProfile: UserProfile | null }) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile || {
    id: initialUser.sub,
    email: initialUser.email,
    name: initialUser.name,
    picture: initialUser.picture,
    addresses: [],
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Profile form state
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "Home", fullName: "", mobile: "", address: "", city: "", state: "", pincode: "", landmark: "", isDefault: false,
  });

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Fetch profile (refresh in background to get latest data from DB)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setEditName(data.name || "");
          setEditPhone(data.phone || "");
        }
      } catch {
        // Fallback to initial user data
        if (!profile) {
          setProfile({ id: initialUser.sub, email: initialUser.email, name: initialUser.name, picture: initialUser.picture, addresses: [] });
        }
        setEditName(initialProfile?.name || initialUser.name || "");
      } finally {
        setLoading(false);
      }
    })();
  }, [initialUser]);

  // Fetch orders using session (cookie-based auth — no email needed)
  useEffect(() => {
    (async () => {
      setOrdersLoading(true);
      try {
        const res = await fetch("/api/orders/list", { cache: "no-store", credentials: "same-origin" });
        if (res.ok) {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
        } else if (res.status === 401) {
          setOrders([]);
        }
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    })();
  }, []);

  const orderStats = useMemo(() => {
    const total = orders.length;
    const totalSpent = orders.reduce((s, o) => s + o.total, 0);
    const pending = orders.filter((o) => o.status === "payment_pending" || o.status === "processing").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    return { total, totalSpent, pending, delivered };
  }, [orders]);

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), phone: editPhone.trim() || undefined }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile((prev) => (prev ? { ...prev, name: updated.name, phone: updated.phone } : prev));
        setIsEditingProfile(false);
        showToast("Profile updated successfully");
      }
    } catch {
      showToast("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const resetAddressForm = () => {
    setAddressForm({ label: "Home", fullName: "", mobile: "", address: "", city: "", state: "", pincode: "", landmark: "", isDefault: false });
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  const handleAddressSubmit = async () => {
    if (!addressForm.fullName || !addressForm.mobile || !addressForm.address || !addressForm.city || !addressForm.state || !addressForm.pincode) return;

    try {
      if (editingAddress) {
        const res = await fetch(`/api/users/addresses/${editingAddress.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressForm),
        });
        if (res.ok) {
          const updated = await res.json();
          setProfile((prev) => (prev ? { ...prev, addresses: prev.addresses.map((a) => (a.id === updated.id ? updated : a)) } : prev));
          showToast("Address updated");
        }
      } else {
        const res = await fetch("/api/users/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressForm),
        });
        if (res.ok) {
          const created = await res.json();
          setProfile((prev) => (prev ? { ...prev, addresses: [...prev.addresses, created] } : prev));
          showToast("Address added");
        }
      }
      resetAddressForm();
    } catch {
      showToast("Failed to save address");
    }
  };

  const handleEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setAddressForm({
      label: addr.label,
      fullName: addr.fullName,
      mobile: addr.mobile,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      landmark: addr.landmark || "",
      isDefault: addr.isDefault,
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const res = await fetch(`/api/users/addresses/${addressId}`, { method: "DELETE" });
      if (res.ok) {
        setProfile((prev) => (prev ? { ...prev, addresses: prev.addresses.filter((a) => a.id !== addressId) } : prev));
        showToast("Address removed");
      }
    } catch {
      showToast("Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const res = await fetch(`/api/users/addresses/${addressId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile((prev) => (prev ? { ...prev, addresses: prev.addresses.map((a) => ({ ...a, isDefault: a.id === addressId })), defaultAddressId: addressId } : prev));
        showToast("Default address updated");
      }
    } catch {
      showToast("Failed to update default address");
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      window.location.href = "/signin";
    } catch {
      window.location.href = "/signin";
    }
  };

  const sidebarContent = (
    <>
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-slate-100 rounded-xl">
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        <span className="text-[14px] font-bold text-slate-900">My Account</span>
        <div className="w-9" />
      </div>

      {/* User card */}
      <div className="p-5 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 shrink-0">
            {profile?.picture ? (
              <Image src={profile.picture} alt={profile.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center">
                <User className="w-5 h-5 text-slate-300" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-slate-900 truncate">{profile?.name || initialUser.name}</p>
            <p className="text-[12px] text-slate-500 truncate">{profile?.email || initialUser.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-0.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                isActive
                  ? "bg-[#2563eb]/10 text-[#2563eb]"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.label}
              {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </button>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="mt-auto p-3 border-t border-slate-200/80">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </>
  );

  if (loading) {
    return (
      <section className="py-[72px] md:py-[88px] bg-white">
        <div className="mx-auto max-w-[1000px] px-5 md:px-8 flex items-center justify-center min-h-[300px]">
          <div className="w-5 h-5 border-2 border-slate-200 border-t-[#2563eb] rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-[72px] md:py-[88px] bg-slate-50/50">
      <div className="mx-auto max-w-[1000px] px-5 md:px-8">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[240px] shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden sticky top-[88px]">
              {sidebarContent}
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <motion.div
                  initial={{ x: -280, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -280, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-white shadow-2xl overflow-y-auto"
                >
                  {sidebarContent}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile header button */}
            <div className="lg:hidden mb-4 flex items-center justify-between">
              <h1 className="text-[18px] font-bold text-slate-900">
                {TABS.find((t) => t.id === activeTab)?.label}
              </h1>
              <button onClick={() => setMobileMenuOpen(true)} className="p-2 bg-white border border-slate-200 rounded-xl">
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h2 className="text-[18px] font-bold text-slate-900 mb-1">
                    Welcome back, {profile?.name?.split(" ")[0] || initialUser.name?.split(" ")[0] || "there"}!
                  </h2>
                  <p className="text-[13px] text-slate-500">Here's what's happening with your account.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                      <ShoppingBag className="w-5 h-5 text-[#2563eb]" />
                    </div>
                    <p className="text-[24px] font-bold text-slate-900">{orderStats.total}</p>
                    <p className="text-[12px] text-slate-500 font-medium">Total Orders</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-[24px] font-bold text-slate-900">{formatCurrency(orderStats.totalSpent)}</p>
                    <p className="text-[12px] text-slate-500 font-medium">Total Spent</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-3">
                      <RefreshCw className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-[24px] font-bold text-slate-900">{orderStats.pending}</p>
                    <p className="text-[12px] text-slate-500 font-medium">In Progress</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
                      <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-[24px] font-bold text-slate-900">{orderStats.delivered}</p>
                    <p className="text-[12px] text-slate-500 font-medium">Delivered</p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setActiveTab("orders")} className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left">
                      <Package className="w-4 h-4 text-[#2563eb]" />
                      <span className="text-[13px] font-medium text-slate-700">View Orders</span>
                    </button>
                    <button onClick={() => setActiveTab("addresses")} className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left">
                      <MapPinned className="w-4 h-4 text-[#2563eb]" />
                      <span className="text-[13px] font-medium text-slate-700">Manage Addresses</span>
                    </button>
                    <button onClick={() => setActiveTab("profile")} className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left">
                      <User className="w-4 h-4 text-[#2563eb]" />
                      <span className="text-[13px] font-medium text-slate-700">Edit Profile</span>
                    </button>
                    <a href="/products" className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left">
                      <ShoppingBag className="w-4 h-4 text-[#2563eb]" />
                      <span className="text-[13px] font-medium text-slate-700">Shop Now</span>
                    </a>
                  </div>
                </div>

                {/* Recent orders */}
                {orders.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recent Orders</p>
                      <button onClick={() => setActiveTab("orders")} className="text-[12px] text-[#2563eb] font-medium hover:underline">View all</button>
                    </div>
                    <div className="space-y-2.5">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div>
                            <p className="text-[13px] font-bold text-slate-700 font-mono">{order.id}</p>
                            <p className="text-[11px] text-slate-500">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[13px] font-bold text-slate-700">{formatCurrency(order.total)}</p>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLORS[order.status] || "bg-slate-100 text-slate-600"}`}>
                              {order.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1">My Orders</h3>
                  <p className="text-[12px] text-slate-500">All your orders in one place</p>
                </div>

                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-5 h-5 border-2 border-slate-200 border-t-[#2563eb] rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
                    <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-[14px] font-medium text-slate-500 mb-1">No orders yet</p>
                    <p className="text-[13px] text-slate-400 mb-4">Your orders will appear here once you make a purchase.</p>
                    <a href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1d4ed8] transition-colors">
                      Start Shopping
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <a
                        key={order.id}
                        href={`/orders/${order.id}`}
                        className="block bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:border-[#2563eb]/30 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-[13px] font-bold text-slate-900 font-mono">{order.id}</p>
                            <p className="text-[11px] text-slate-500">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              order.paymentMethod === "cod" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                            }`}>
                              {order.paymentMethod === "cod" ? "COD" : "Online"}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_COLORS[order.status] || "bg-slate-100 text-slate-600"}`}>
                              {order.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>

                        {/* Items preview */}
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                          {order.items.slice(0, 4).map((item) => (
                            <div key={item.productId} className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                              {item.quantity > 1 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                  {item.quantity}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <span className="text-[12px] text-slate-500">{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                          <span className="text-[14px] font-bold text-slate-900">{formatCurrency(order.total)}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 mb-1">Saved Addresses</h3>
                    <p className="text-[12px] text-slate-500">{profile?.addresses?.length || 0} address{(profile?.addresses?.length || 0) !== 1 ? "es" : ""} saved</p>
                  </div>
                  <button
                    onClick={() => { resetAddressForm(); setShowAddressForm(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1d4ed8] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </button>
                </div>

                {/* Address Form */}
                <AnimatePresence>
                  {showAddressForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
                    >
                      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <p className="text-[14px] font-bold text-slate-900">{editingAddress ? "Edit Address" : "Add New Address"}</p>
                        <button onClick={resetAddressForm} className="p-1.5 hover:bg-slate-100 rounded-lg">
                          <X className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      <div className="p-5 space-y-3">
                        <div>
                          <label className="block text-[12px] font-medium text-slate-600 mb-1">Label</label>
                          <select value={addressForm.label} onChange={(e) => setAddressForm((f) => ({ ...f, label: e.target.value }))} className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[12px] font-medium text-slate-600 mb-1">Full Name *</label>
                            <input type="text" value={addressForm.fullName} onChange={(e) => setAddressForm((f) => ({ ...f, fullName: e.target.value }))} placeholder="Enter full name" className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                          </div>
                          <div>
                            <label className="block text-[12px] font-medium text-slate-600 mb-1">Mobile Number *</label>
                            <input type="tel" value={addressForm.mobile} onChange={(e) => setAddressForm((f) => ({ ...f, mobile: e.target.value }))} placeholder="10-digit mobile" className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[12px] font-medium text-slate-600 mb-1">Address *</label>
                          <textarea value={addressForm.address} onChange={(e) => setAddressForm((f) => ({ ...f, address: e.target.value }))} placeholder="House/Flat No., Building, Street" rows={2} className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
                        </div>
                        <div>
                          <label className="block text-[12px] font-medium text-slate-600 mb-1">Landmark (optional)</label>
                          <input type="text" value={addressForm.landmark} onChange={(e) => setAddressForm((f) => ({ ...f, landmark: e.target.value }))} placeholder="Near landmark" className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[12px] font-medium text-slate-600 mb-1">City *</label>
                            <input type="text" value={addressForm.city} onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))} placeholder="City" className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                          </div>
                          <div>
                            <label className="block text-[12px] font-medium text-slate-600 mb-1">State *</label>
                            <select value={addressForm.state} onChange={(e) => setAddressForm((f) => ({ ...f, state: e.target.value }))} className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
                              <option value="">Select state</option>
                              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[12px] font-medium text-slate-600 mb-1">PIN Code *</label>
                            <input type="text" value={addressForm.pincode} onChange={(e) => setAddressForm((f) => ({ ...f, pincode: e.target.value }))} placeholder="6-digit PIN" maxLength={6} className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                          </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm((f) => ({ ...f, isDefault: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]" />
                          <span className="text-[13px] text-slate-600">Set as default address</span>
                        </label>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={handleAddressSubmit}
                            disabled={!addressForm.fullName || !addressForm.mobile || !addressForm.address || !addressForm.city || !addressForm.state || !addressForm.pincode}
                            className="px-5 py-2.5 bg-[#2563eb] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {editingAddress ? "Update Address" : "Save Address"}
                          </button>
                          <button onClick={resetAddressForm} className="px-5 py-2.5 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl hover:bg-slate-50 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Address List */}
                <div className="space-y-3">
                  {(!profile?.addresses || profile.addresses.length === 0) && !showAddressForm && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
                      <MapPin className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <p className="text-[14px] font-medium text-slate-500 mb-1">No addresses saved</p>
                      <p className="text-[13px] text-slate-400">Add an address for faster checkout.</p>
                    </div>
                  )}
                  {profile?.addresses?.map((addr) => (
                    <div key={addr.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm relative group">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${addr.isDefault ? "bg-green-50" : "bg-slate-100"}`}>
                            <MapPinned className={`w-5 h-5 ${addr.isDefault ? "text-green-600" : "text-slate-400"}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-[13px] font-bold text-slate-900">{addr.label}</p>
                              {addr.isDefault && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">Default</span>
                              )}
                            </div>
                            <p className="text-[13px] font-medium text-slate-700">{addr.fullName}</p>
                            <p className="text-[12px] text-slate-500">{addr.address}</p>
                            {addr.landmark && <p className="text-[12px] text-slate-500">Near {addr.landmark}</p>}
                            <p className="text-[12px] text-slate-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                            <p className="text-[12px] text-slate-500 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" />{addr.mobile}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!addr.isDefault && (
                            <button onClick={() => handleSetDefault(addr.id)} className="p-1.5 hover:bg-green-50 rounded-lg" title="Set as default">
                              <Check className="w-3.5 h-3.5 text-green-600" />
                            </button>
                          )}
                          <button onClick={() => handleEditAddress(addr)} className="p-1.5 hover:bg-blue-50 rounded-lg" title="Edit">
                            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                          </button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete">
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1">Personal Information</h3>
                  <p className="text-[12px] text-slate-500">Manage your personal details</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="p-5 flex items-center gap-4 border-b border-slate-100">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 shrink-0">
                      {profile?.picture ? (
                        <Image src={profile.picture} alt={profile.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#f8fafc] flex items-center justify-center">
                          <User className="w-6 h-6 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-slate-900">{profile?.name || initialUser.name}</p>
                      <p className="text-[13px] text-slate-500 flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{profile?.email || initialUser.email}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {isEditingProfile ? (
                      <>
                        <div>
                          <label className="block text-[12px] font-medium text-slate-600 mb-1">Full Name</label>
                          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                        <div>
                          <label className="block text-[12px] font-medium text-slate-600 mb-1">Phone Number</label>
                          <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Add phone number" className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button onClick={handleSaveProfile} disabled={saving || !editName.trim()} className="px-5 py-2.5 bg-[#2563eb] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1d4ed8] transition-colors disabled:opacity-50">
                            {saving ? "Saving..." : "Save Changes"}
                          </button>
                          <button onClick={() => { setIsEditingProfile(false); setEditName(profile?.name || ""); setEditPhone(profile?.phone || ""); }} className="px-5 py-2.5 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl hover:bg-slate-50 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-[12px] text-slate-500 font-medium">Full Name</p>
                            <p className="text-[14px] text-slate-900 font-medium">{profile?.name || initialUser.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-2 border-t border-slate-100">
                          <div>
                            <p className="text-[12px] text-slate-500 font-medium">Email</p>
                            <p className="text-[14px] text-slate-900 font-medium">{profile?.email || initialUser.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-2 border-t border-slate-100">
                          <div>
                            <p className="text-[12px] text-slate-500 font-medium">Phone</p>
                            <p className="text-[14px] text-slate-900 font-medium">{profile?.phone || "Not set"}</p>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-slate-100">
                          <button
                            onClick={() => setIsEditingProfile(true)}
                            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 text-[13px] font-medium rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit Profile
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-[70] px-5 py-3 bg-slate-900 text-white text-[13px] font-medium rounded-xl shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
