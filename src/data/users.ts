import type { Order } from "./orders";

export interface Address {
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

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  phone?: string;
  addresses: Address[];
  defaultAddressId?: string;
  createdAt: string;
  updatedAt: string;
}

const USERS_FILE = "users.json";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function getUser(id: string): Promise<User | null> {
  try {
    const { readJsonFile } = await import("@/lib/db");
    const users = await readJsonFile<User[]>(USERS_FILE);
    return users.find((u) => u.id === id) ?? null;
  } catch {
    return null;
  }
}

export async function getAddresses(userId: string): Promise<Address[]> {
  const user = await getUser(userId);
  return user?.addresses ?? [];
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { readJsonFile } = await import("@/lib/db");
    const users = await readJsonFile<User[]>(USERS_FILE);
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  } catch {
    return null;
  }
}

export async function createUser(user: Omit<User, "createdAt" | "updatedAt">): Promise<User> {
  const { writeJsonFile } = await import("@/lib/db");
  const now = new Date().toISOString();
  const newUser: User = {
    ...user,
    createdAt: now,
    updatedAt: now,
  };
  const users = await getUsersInternal();
  users.push(newUser);
  await writeJsonFile(USERS_FILE, users);
  return newUser;
}

export async function updateUser(id: string, updates: Partial<Pick<User, "name" | "phone" | "picture">>): Promise<User | null> {
  const { writeJsonFile } = await import("@/lib/db");
  const users = await getUsersInternal();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFile(USERS_FILE, users);
  return users[index];
}

export async function addAddress(userId: string, address: Omit<Address, "id">): Promise<Address> {
  const { writeJsonFile } = await import("@/lib/db");
  const users = await getUsersInternal();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) throw new Error("User not found");

  const newAddress: Address = {
    ...address,
    id: generateId(),
  };

  // If this is the first address or marked as default, unset others
  if (newAddress.isDefault || users[index].addresses.length === 0) {
    users[index].addresses.forEach((a) => (a.isDefault = false));
    newAddress.isDefault = true;
    users[index].defaultAddressId = newAddress.id;
  }

  users[index].addresses.push(newAddress);
  users[index].updatedAt = new Date().toISOString();
  await writeJsonFile(USERS_FILE, users);
  return newAddress;
}

export async function updateAddress(
  userId: string,
  addressId: string,
  updates: Partial<Omit<Address, "id">>
): Promise<Address | null> {
  const { writeJsonFile } = await import("@/lib/db");
  const users = await getUsersInternal();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  const addrIndex = users[index].addresses.findIndex((a) => a.id === addressId);
  if (addrIndex === -1) return null;

  // If setting as default, unset others
  if (updates.isDefault) {
    users[index].addresses.forEach((a) => (a.isDefault = false));
    users[index].defaultAddressId = addressId;
  }

  users[index].addresses[addrIndex] = {
    ...users[index].addresses[addrIndex],
    ...updates,
  };
  users[index].updatedAt = new Date().toISOString();
  await writeJsonFile(USERS_FILE, users);
  return users[index].addresses[addrIndex];
}

export async function deleteAddress(userId: string, addressId: string): Promise<boolean> {
  const { writeJsonFile } = await import("@/lib/db");
  const users = await getUsersInternal();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return false;

  const addrIndex = users[index].addresses.findIndex((a) => a.id === addressId);
  if (addrIndex === -1) return false;

  const wasDefault = users[index].addresses[addrIndex].isDefault;
  users[index].addresses.splice(addrIndex, 1);

  // If we deleted the default address, pick the first remaining one as default
  if (wasDefault && users[index].addresses.length > 0) {
    users[index].addresses[0].isDefault = true;
    users[index].defaultAddressId = users[index].addresses[0].id;
  } else if (users[index].addresses.length === 0) {
    users[index].defaultAddressId = undefined;
  }

  users[index].updatedAt = new Date().toISOString();
  await writeJsonFile(USERS_FILE, users);
  return true;
}

export async function setDefaultAddress(userId: string, addressId: string): Promise<boolean> {
  const { writeJsonFile } = await import("@/lib/db");
  const users = await getUsersInternal();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return false;

  const addrIndex = users[index].addresses.findIndex((a) => a.id === addressId);
  if (addrIndex === -1) return false;

  users[index].addresses.forEach((a) => (a.isDefault = a.id === addressId));
  users[index].defaultAddressId = addressId;
  users[index].updatedAt = new Date().toISOString();
  await writeJsonFile(USERS_FILE, users);
  return true;
}

async function getUsersInternal(): Promise<User[]> {
  try {
    const { readJsonFile } = await import("@/lib/db");
    const users = await readJsonFile<User[]>(USERS_FILE);
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}
