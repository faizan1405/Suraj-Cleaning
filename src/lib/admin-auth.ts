import { cookies } from "next/headers";

const SESSION_COOKIE = "admin-session";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) return false;
  return session.value === process.env.ADMIN_SESSION_SECRET;
}

export function validatePassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}
