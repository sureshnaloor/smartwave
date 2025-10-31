"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, useTransition, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import { User, ShoppingCart, Heart, Settings, ShoppingBag, Loader2, UserCheck, LayoutDashboard } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { saveThemePreference, getThemePreference } from "@/app/_actions/theme";
import { toast } from "@/components/ui/use-toast";
import { useFormStatus } from "react-dom";
import WishlistItems from "@/components/wishlist/WishlistItems";
import CartItems from "@/components/cart/CartItems";
import OrderItems from "@/components/order/OrderItems";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { saveEmailPreferences } from "@/app/_actions/user-preferences";
import { Truck } from "lucide-react"; // Add to imports

import ShippingAddresses from "@/components/shipping/ShippingAddresses";
import UserDashboardlogin from "@/components/dashboardlogin/UserDashboardlogin";
import UserOverview from "@/components/dashboard/UserOverview";

// Submit button with loading state for theme form
function SaveThemeButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      size="sm"
      className="w-20"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving
        </>
      ) : (
        'Save'
      )}
    </Button>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const themeTimerRef = useRef<number | null>(null);
  const [marketingPending, setMarketingPending] = useState(false);
  const [promoPending, setPromoPending] = useState(false);
  const marketingTimerRef = useRef<number | null>(null);
  const promoTimerRef = useRef<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window === 'undefined') return 'dashboard';
    return sessionStorage.getItem('profile_active_tab') || 'dashboard';
  });

  // Check user authentication
  useEffect(() => {
    setMounted(true);
    if (mounted && status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router, mounted]);

  // Persist selected tab to avoid resets on re-render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('profile_active_tab', activeTab);
    }
  }, [activeTab]);

  // Handle form submission
  const handleThemeFormSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await saveThemePreference(formData);
        
        if (result.success) {
          toast({
            title: "Theme Saved",
            description: "Your theme preference has been saved successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to save theme preference",
            variant: "destructive",
          });
        }
      } catch (error) {
        // console.error("Error saving theme:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while saving your theme preference.",
          variant: "destructive",
        });
      }
    });
  };

  // Handle theme selection change
  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
    if (!formRef.current) return;
    if (themeTimerRef.current) {
      window.clearTimeout(themeTimerRef.current);
    }
    themeTimerRef.current = window.setTimeout(() => {
      if (!formRef.current) return;
      const formData = new FormData(formRef.current);
      formData.set('theme', value);
      handleThemeFormSubmit(formData);
      themeTimerRef.current = null;
    }, 1000) as unknown as number;
  };

  if (status === "loading" || !mounted) {
    return <LoadingSpinner />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <div className="mr-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">{session?.user?.email}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-8">  {/* Changed from grid-cols-5 */}
          <TabsTrigger value="dashboard" className="flex gap-2 items-center">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="profile-setup" className="flex gap-2 items-center">
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex gap-2 items-center">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex gap-2 items-center">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Wishlist</span>
          </TabsTrigger>
          <TabsTrigger value="cart" className="flex gap-2 items-center">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex gap-2 items-center">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex gap-2 items-center">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Shipping</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <Suspense fallback={<LoadingSpinner />}>
            <UserOverview />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="profile-setup">
          <Suspense fallback={<LoadingSpinner />}>
            <UserDashboardlogin />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={session?.user?.image || ''} />
                    <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-medium">{session?.user?.name}</p>
                    <p className="text-sm text-gray-500">{session?.user?.email}</p>
                    <p className="text-xs text-gray-400">Google Account</p>
                  </div>
                      </div>
                    </div>
                    
              {/* Theme Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme Preferences</h3>
                <form ref={formRef} action={handleThemeFormSubmit} className="space-y-4">
                  {/* ... existing theme form content ... */}
                </form>
              </div>
              
              {/* Email Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Preferences</h3>
                <div className="space-y-4">
                  {/* Required Notifications */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Order & Account Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Notifications about your orders, cart, and wishlist (required)
                      </p>
                    </div>
                    <Switch checked={true} disabled />
                  </div>

                  {/* Marketing Emails */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-gray-500">
                        Receive updates about new products and features
                      </p>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={false}
                      disabled={marketingPending}
                      onCheckedChange={(checked) => {
                        if (marketingTimerRef.current) {
                          window.clearTimeout(marketingTimerRef.current);
                        }
                        setMarketingPending(true);
                        marketingTimerRef.current = window.setTimeout(async () => {
                          try {
                            const result = await saveEmailPreferences({ marketingEmails: checked });
                            if (result.success) {
                              toast({
                                title: "Preferences Updated",
                                description: "Your email preferences have been saved.",
                              });
                            } else {
                              toast({
                                title: "Error",
                                description: "Failed to update email preferences",
                                variant: "destructive",
                              });
                            }
                          } catch (error) {
                            toast({
                              title: "Error",
                              description: "An unexpected error occurred",
                              variant: "destructive",
                            });
                          } finally {
                            setMarketingPending(false);
                            marketingTimerRef.current = null;
                          }
                        }, 1000) as unknown as number;
                      }}
                    />
                  </div>

                  {/* Promotional Emails */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="promotional-emails">Promotional Emails</Label>
                      <p className="text-sm text-gray-500">
                        Receive discount coupons and special offers
                      </p>
                    </div>
                    <Switch
                      id="promotional-emails"
                      checked={false}
                      disabled={promoPending}
                      onCheckedChange={(checked) => {
                        if (promoTimerRef.current) {
                          window.clearTimeout(promoTimerRef.current);
                        }
                        setPromoPending(true);
                        promoTimerRef.current = window.setTimeout(async () => {
                          try {
                            const result = await saveEmailPreferences({ promotionalEmails: checked });
                            if (result.success) {
                              toast({
                                title: "Preferences Updated",
                                description: "Your email preferences have been saved.",
                              });
                            } else {
                              toast({
                                title: "Error",
                                description: "Failed to update email preferences",
                                variant: "destructive",
                              });
                            }
                          } catch (error) {
                            toast({
                              title: "Error",
                              description: "An unexpected error occurred",
                              variant: "destructive",
                            });
                          } finally {
                            setPromoPending(false);
                            promoTimerRef.current = null;
                          }
                        }, 1000) as unknown as number;
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wishlist">
          <Suspense fallback={<LoadingSpinner />}>
            <WishlistItems />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="cart">
          <Suspense fallback={<LoadingSpinner />}>
            <CartItems />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="orders">
          <Suspense fallback={<LoadingSpinner />}>
            <OrderItems />
          </Suspense>
        </TabsContent>

        {/* // In  TabsContent for shipping */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Addresses</CardTitle>
              <CardDescription>Manage your shipping addresses</CardDescription>
            </CardHeader>
            <CardContent>
              <ShippingAddresses />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 