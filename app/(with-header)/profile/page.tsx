"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, ShoppingCart, Heart, Settings, ShoppingBag } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);

  // Check user authentication
  useEffect(() => {
    setMounted(true);
    if (mounted && status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router, mounted]);

  // For demo purposes, load preferred theme from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("preferredTheme") || "light";
      setSelectedTheme(storedTheme);
    }
  }, []);

  const saveThemePreference = (theme: string) => {
    setSelectedTheme(theme);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredTheme", theme);
    }
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
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme-select">Default Theme</Label>
                    <Select value={selectedTheme} onValueChange={saveThemePreference}>
                      <SelectTrigger id="theme-select" className="w-40">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Automatically enable dark mode based on your system settings.
                      </p>
                    </div>
                    <Switch 
                      id="dark-mode" 
                      checked={selectedTheme === "system"} 
                      onCheckedChange={() => saveThemePreference(selectedTheme === "system" ? "light" : "system")} 
                    />
                  </div>
                </div>
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
              <Button className="ml-auto">Save Changes</Button>
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