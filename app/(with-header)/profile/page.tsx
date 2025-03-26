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
import { User, ShoppingCart, Heart, Settings, ShoppingBag, Loader2, Package } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { saveThemePreference, getThemePreference } from "@/app/_actions/theme";
import { toast } from "@/components/ui/use-toast";
import { useFormStatus } from "react-dom";
import { getUserPreferences } from "@/app/_actions/user-preferences";
import Image from "next/image";
import WishlistItems from "@/components/wishlist/WishlistItems";
import CartItems from "@/components/cart/CartItems";
import { CurrencyInfo, DEFAULT_CURRENCY } from "@/lib/currencyTypes";

// Types matching the schemas in user-preferences.ts
interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  type: string;
  quantity: number;
  color?: string;
  image?: string;
  currency?: string;
}

interface CartItem extends WishlistItem {}

interface OrderItem extends CartItem {}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  shippingAddress?: {
    fullName?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

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
  
  // User preferences states
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState<CurrencyInfo>(DEFAULT_CURRENCY);

  // Format price with the appropriate currency symbol and position
  const formatPrice = (price: number): string => {
    if (!userCurrency) return `$${price.toFixed(2)}`;
    
    return userCurrency.position === 'before'
      ? `${userCurrency.symbol}${price.toFixed(2)}`
      : `${price.toFixed(2)} ${userCurrency.symbol}`;
  };

  // Check user authentication
  useEffect(() => {
    setMounted(true);
    if (mounted && status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router, mounted]);

  // Load user's currency preference from localStorage
  useEffect(() => {
    if (mounted) {
      try {
        const storedCurrency = localStorage.getItem('userCurrency');
        if (storedCurrency) {
          setUserCurrency(JSON.parse(storedCurrency));
        }
      } catch (error) {
        console.error("Failed to parse stored currency:", error);
      }
    }
  }, [mounted]);

  // Load theme preference and user data from the database
  useEffect(() => {
    const loadData = async () => {
      if (status === "authenticated" && session?.user?.email) {
        startTransition(async () => {
          try {
            // Load theme preferences
            const themeResult = await getThemePreference();
            if (themeResult.success) {
              setSelectedTheme(themeResult.theme);
            }
            
            // Load user preferences (cart, wishlist, orders)
            const userPrefs = await getUserPreferences();
            if (userPrefs) {
              // Ensure color is a string before setting state
              const sanitizedWishlist = userPrefs.wishlist?.map(item => ({
                ...item,
                color: Array.isArray(item.color) ? item.color[0] : item.color
              })) || [];

              const sanitizedCart = userPrefs.cart?.map(item => ({
                ...item,
                color: Array.isArray(item.color) ? item.color[0] : item.color
              })) || [];
              
              setWishlistItems(sanitizedWishlist);
              setCartItems(sanitizedCart);
              setOrders((userPrefs.orders || []).map(order => ({
                ...order,
                items: order.items.map(item => ({
                  ...item,
                  color: typeof item.color === 'string' ? item.color : Array.isArray(item.color) ? item.color[0] : undefined
                }))
              })));
            }
          } catch (error) {
            console.error("Failed to load user data:", error);
          } finally {
            setUserDataLoading(false);
          }
        });
      }
    };

    if (mounted && status === "authenticated") {
      loadData();
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
          </Card>
        </TabsContent>
        
        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>Your Wishlist</CardTitle>
              <CardDescription>
                Items you've saved for later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userDataLoading ? (
                <div className="w-full h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Heart className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-500 mb-6">Add items to your wishlist to save them for later</p>
                  <Button onClick={() => router.push("/store")}>
                    Browse Store
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlistItems.map((item) => (
                    <Card key={item.productId} className="flex flex-row overflow-hidden">
                      {item.image && (
                        <div className="relative h-24 w-24">
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-col flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm font-medium">{formatPrice(item.price)}</p>
                        </div>
                        {item.color && (
                          <p className="text-xs text-gray-500 mt-1 capitalize">
                            Color: {item.color}
                          </p>
                        )}
                        <div className="mt-auto flex justify-end">
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="h-8 px-2"
                            onClick={() => router.push('/wishlist')}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            {wishlistItems.length > 0 && (
              <CardFooter className="justify-end">
                <Button onClick={() => router.push('/wishlist')}>
                  View Full Wishlist
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="cart">
          <Card>
            <CardHeader>
              <CardTitle>Your Shopping Cart</CardTitle>
              <CardDescription>
                Items you've added to your cart.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userDataLoading ? (
                <div className="w-full h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add items to your cart to checkout</p>
                  <Button onClick={() => router.push("/store")}>
                    Browse Store
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cartItems.map((item) => (
                    <Card key={item.productId} className="flex flex-row overflow-hidden">
                      {item.image && (
                        <div className="relative h-24 w-24">
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-col flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm font-medium">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center mt-1">
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          {item.color && (
                            <p className="text-xs text-gray-500 ml-3 capitalize">
                              Color: {item.color}
                            </p>
                          )}
                        </div>
                        <div className="mt-auto flex justify-between items-center">
                          <p className="text-sm font-medium">
                            Subtotal: {formatPrice(item.price * item.quantity)}
                          </p>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="h-8 px-2"
                            onClick={() => router.push('/cart')}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            {cartItems.length > 0 && (
              <CardFooter className="justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Total: {formatPrice(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => router.push('/cart')}>
                    View Full Cart
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>
                View and track your orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userDataLoading ? (
                <div className="w-full h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Package className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-6">Start shopping to place your first order</p>
                  <Button onClick={() => router.push("/store")}>
                    Browse Store
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium">Order #{order.id}</p>
                            <p className="text-xs text-gray-500">
                              Placed on {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                            <span 
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                  'bg-blue-100 text-blue-800'}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-2">Items:</p>
                          <div className="space-y-2">
                            {order.items.map((item: OrderItem, index: number) => (
                              <div key={index} className="flex justify-between text-sm">
                                <div className="flex-1">
                                  <span className="font-medium">{item.name}</span>
                                  <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                </div>
                                <span>{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 