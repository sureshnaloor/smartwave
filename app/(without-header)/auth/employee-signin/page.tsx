"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function EmployeeSignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const user = session.user as { role?: string; firstLoginDone?: boolean };
        if (user.role === "employee") {
          router.replace(user.firstLoginDone === false ? "/employee/change-password" : "/employee/dashboard");
          return;
        }
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    if (errorParam === "CredentialsSignin") {
      setError("Invalid work email or password. If this is your first sign-in, use the temporary password from your company admin.");
    } else if (errorParam) {
      setError("Sign-in failed. Please try again.");
    }
  }, [errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError("Please enter your work email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: trimmedEmail,
        password,
        callbackUrl: "/employee/dashboard",
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid work email or password. If this is your first sign-in, use the temporary password from your company admin.");
        return;
      }
      if (result?.ok) {
        router.push("/employee/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Company profile sign-in
            </CardTitle>
            <CardDescription>
              Sign in with the work email and password provided by your company admin. You will be asked to set a new password on first sign-in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:text-red-400 dark:bg-red-900/20 dark:border-red-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Work email
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Sign in
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Privacy Policy
              </Link>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you an Admin or Public Admin?{" "}
                <Link href="/admin/login" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium">
                  Admin Login
                </Link>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Not a company profile?{" "}
                <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium">
                  Sign in with Google
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
