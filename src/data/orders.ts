export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  subtotal: number;
}

export interface Order {
  _id?: string;
  id: string;
  userId?: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentMethod: "cod" | "razorpay";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  status: "payment_pending" | "confirmed" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
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

const ORDERS_FILE = "orders.json";

export async function getOrders(): Promise<Order[]> {
  try {
    const { readJsonFile } = await import("@/lib/db");
    const orders = await readJsonFile<Order[]>(ORDERS_FILE);
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const orders = await getOrders();
  return orders
    .filter((o) => (o as any).userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const orders = await getOrders();
  return orders
    .filter((o) => o.customer.email.toLowerCase() === email.toLowerCase())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.razorpayOrderId === razorpayOrderId) ?? null;
}

export async function getOrderByRazorpayPaymentId(razorpayPaymentId: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.razorpayPaymentId === razorpayPaymentId) ?? null;
}

export async function createOrder(order: Order): Promise<Order> {
  const { writeJsonFile } = await import("@/lib/db");
  const orders = await getOrders();
  orders.push(order);
  await writeJsonFile(ORDERS_FILE, orders);
  return order;
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
  const { writeJsonFile } = await import("@/lib/db");
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() };
  await writeJsonFile(ORDERS_FILE, orders);
  return orders[index];
}
