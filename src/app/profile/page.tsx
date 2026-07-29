import { getSession } from "@/lib/auth";
import { getUser } from "@/data/users";
import type { User } from "@/data/users";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";
import type { SessionUser } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/signin");

  const sessionData = session as NonNullable<typeof session>;
  const user: SessionUser = {
    sub: sessionData.sub,
    email: sessionData.email,
    name: sessionData.name,
    picture: sessionData.picture,
  };

  // Fetch full user profile from DB (if it exists)
  let profileData: { id: string; email: string; name: string; picture?: string; phone?: string; addresses: User["addresses"]; defaultAddressId?: string } | null = null;
  try {
    const userData = await getUser(sessionData.sub);
    if (userData) {
      profileData = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        phone: userData.phone,
        addresses: userData.addresses,
        defaultAddressId: userData.defaultAddressId,
      };
    }
  } catch {
    // DB may not be available yet
  }

  return <ProfileClient initialUser={user} initialProfile={profileData} />;
}
