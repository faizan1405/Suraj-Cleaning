import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";
import type { SessionUser } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/signin");

  const user: SessionUser = {
    sub: session.sub,
    email: session.email,
    name: session.name,
    picture: session.picture,
  };

  return <ProfileClient initialUser={user} />;
}
