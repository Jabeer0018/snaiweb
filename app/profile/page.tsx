import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProfileClient } from "@/components/ProfileClient";

export const metadata = {
  title: "Profile & Progress",
};

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user as
    | {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        provider?: string;
      }
    | undefined;

  if (!user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  return (
    <ProfileClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        provider: user.provider,
      }}
    />
  );
}
