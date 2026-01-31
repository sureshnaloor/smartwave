"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Wallet } from "lucide-react";

export default function EmployeeDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<{ shorturl?: string; name?: string } | null>(null);

  const user = session?.user as { role?: string; firstLoginDone?: boolean } | undefined;
  const isEmployee = user?.role === "employee";

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email || !isEmployee) return;
    import("@/app/_actions/profile").then(({ getProfile }) => {
      getProfile(session.user!.email!).then(setProfile);
    });
  }, [status, session, isEmployee]);

  if (status === "loading") return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  if (status === "unauthenticated" || !isEmployee) {
    router.replace("/auth/signin");
    return null;
  }

  const base = typeof window !== "undefined" ? window.location.origin : "";
  const publicUrl = profile?.shorturl ? `${base}/publicprofile/${profile.shorturl}` : null;
  const appleWalletUrl = profile?.shorturl ? `${base}/api/wallet/apple?shorturl=${profile.shorturl}` : null;
  const googleWalletUrl = profile?.shorturl ? `${base}/api/wallet/google?shorturl=${profile.shorturl}` : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Your profile</h1>
      <p className="text-muted-foreground mb-8">
        View and share your digital profile. Only your company admin can edit your details.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              View & share profile
            </CardTitle>
            <CardDescription>
              Your profile is managed by your company admin. Share the link or add to wallet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {publicUrl ? (
              <>
                <Link href={publicUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">Open my profile</Button>
                </Link>
                <p className="text-xs text-muted-foreground break-all">{publicUrl}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Your shareable link is being set up. Check back shortly.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Add to wallet
            </CardTitle>
            <CardDescription>
              Add your digital card to Apple Wallet or Google Wallet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {appleWalletUrl && googleWalletUrl ? (
              <>
                <a href={appleWalletUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">Add to Apple Wallet</Button>
                </a>
                <a href={googleWalletUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">Save to Google Wallet</Button>
                </a>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Wallet links will appear once your profile is ready.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Link href="/myprofile">
          <Button variant="secondary">View full profile page</Button>
        </Link>
      </div>
    </div>
  );
}
