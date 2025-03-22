"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, ShoppingCart, Heart, Settings, ShoppingBag, Loader2 } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { saveThemePreference, getThemePreference } from "@/app/_actions/theme";
import { toast } from "@/components/ui/use-toast";
import { useFormStatus } from "react-dom";

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

  // Check user authentication
  useEffect(() => {
    setMounted(true);
    if (mounted && status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router, mounted]);

  // Load theme preference from the database
  useEffect(() => {
    const loadThemePreference = async () => {
      if (status === "authenticated" && session?.user?.email) {
        startTransition(async () => {
          try {
            const result = await getThemePreference();
            if (result.success) {
              setSelectedTheme(result.theme);
            }
          } catch (error) {
            console.error("Failed to load theme preference:", error);
          }
        });
      }
    };

    if (mounted && status === "authenticated") {
      loadThemePreference();
    }
  }, [mounted, status, session?.user?.email]);

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
        console.error("Error saving theme:", error);
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
    
    // Submit the form after updating the state
    setTimeout(() => {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        formData.set('theme', value);
        handleThemeFormSubmit(formData);
      }
    }, 0);
  };

  // Show loading state
  if (status === "loading" || !mounted) {
    return <LoadingSpinner />;
  }

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  // Sample data for demo
  const wishlistItems = [
    { id: 1, name: "Premium Digital Card", price: 29.99 },
    { id: 2, name: "Executive Card Package", price: 49.99 },
  ];
  
  const cartItems = [
    { id: 3, name: "Smart Business Card", price: 19.99, quantity: 1 },
  ];

  const orders = [
    { id: "ORD-001", date: "2023-12-15", status: "Delivered", total: 29.99 },
    { id: "ORD-002", date: "2024-02-20", status: "Processing", total: 49.99 },
  ];

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

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
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
        </TabsList>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Theme Preferences</h3>
                
                <form 
                  ref={formRef}
                  action={handleThemeFormSubmit}
                  className="space-y-4"
                >
                  <input type="hidden" name="theme" value={selectedTheme} />
                  
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="theme-select">Default Theme</Label>
                      <div className="flex items-center gap-2">
                        <Select 
                          value={selectedTheme} 
                          onValueChange={handleThemeChange}
                          disabled={isPending}
                        >
                          <SelectTrigger id="theme-select" className="w-32">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dark-mode">System Mode</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Automatically switch between light and dark based on your system settings.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          id="dark-mode" 
                          name="system-toggle"
                          checked={selectedTheme === "system"} 
                          onCheckedChange={(checked) => {
                            handleThemeChange(checked ? "system" : "light");
                          }}
                          disabled={isPending}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications about your account and orders.
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive emails about new products and promotions.
                      </p>
                    </div>
                    <Switch id="marketing-emails" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save All Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>Your Wishlist</CardTitle>
              <CardDescription>
                Items you're interested in purchasing later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {wishlistItems.length > 0 ? (
                <ul className="divide-y">
                  {wishlistItems.map((item) => (
                    <li key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <Button variant="outline" size="sm">Move to Cart</Button>
                        <Button variant="ghost" size="sm" className="text-red-500">Remove</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <Heart className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                  <h3 className="mt-2 text-lg font-medium">Your wishlist is empty</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    Browse our products and add items to your wishlist.
                  </p>
                  <Button className="mt-4">Browse Products</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cart">
          <Card>
            <CardHeader>
              <CardTitle>Shopping Cart</CardTitle>
              <CardDescription>
                Items you've added to your cart.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cartItems.length > 0 ? (
                <div>
                  <ul className="divide-y">
                    {cartItems.map((item) => (
                      <li key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 sm:mt-0">
                          <div className="flex items-center">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">-</Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">+</Button>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-500">Remove</Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 border-t pt-6">
                    <div className="flex justify-between text-lg font-medium">
                      <span>Total</span>
                      <span>${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
                    </div>
                    <Button className="w-full mt-4">Checkout</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                  <h3 className="mt-2 text-lg font-medium">Your cart is empty</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    Add items to your cart to proceed to checkout.
                  </p>
                  <Button className="mt-4">Browse Products</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View your past orders and their status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">{order.date}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === "Delivered" ? "bg-green-100 text-green-800" : 
                              order.status === "Processing" ? "bg-blue-100 text-blue-800" : 
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">${order.total.toFixed(2)}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                            <Button variant="link" size="sm">View Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                  <h3 className="mt-2 text-lg font-medium">No orders yet</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    When you place an order, it will appear here.
                  </p>
                  <Button className="mt-4">Browse Products</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 