"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getUserPreferences, saveCart, saveOrder } from "@/app/_actions/user-preferences"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ShoppingBag, Trash, Plus, Minus, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { useCountry } from '@/context/CountryContext';
import { currencyConfig } from '@/lib/currencyConfig';
import { useCart } from '@/context/CartContext';

interface CartItem {
  productId: string
  name: string
  price: number
  type: string
  quantity: number
  color?: string
  image?: string
}

// CartItem component integrated into CartItems
function CartItemRow({
  item,
  formatPrice,
  onUpdateQuantity,
  onRemove,
  processingQuantity
}: {
  item: CartItem
  formatPrice: (price: number) => string
  onUpdateQuantity: (id: string, quantity: number) => Promise<void>
  onRemove: (id: string) => Promise<void>
  processingQuantity: string | null
}) {
  const formattedPrice = formatPrice(item.price);
  const itemTotal = formatPrice(item.price * item.quantity);

  return (
    <Card key={item.productId} className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {item.image && (
          <div className="relative h-48 sm:h-auto sm:w-48 flex-shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-grow p-4 flex flex-col">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <p className="text-sm font-medium">{formattedPrice}</p>
          </CardHeader>
          <CardContent className="p-0 flex-grow">
            <p className="text-sm text-gray-500">
              {item.color && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                  {item.color}
                </span>
              )}
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {item.type}
              </span>
            </p>
          </CardContent>
          <CardFooter className="p-0 pt-4 flex flex-wrap justify-between gap-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-r-none"
                onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                disabled={processingQuantity === item.productId || item.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                disabled={processingQuantity === item.productId}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-l-none"
                onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                disabled={processingQuantity === item.productId}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium">{itemTotal}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.productId)}
                disabled={processingQuantity === item.productId}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}

export default function CartItems() {
  const router = useRouter()
  const { selectedCountry } = useCountry();
  const { refreshCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processingQuantity, setProcessingQuantity] = useState<string | null>(null)
  const [processingCheckout, setProcessingCheckout] = useState(false)

  const fetchCart = async () => {
    try {
      const userPrefs = await getUserPreferences()
      if (userPrefs?.cart) {
        setCartItems(userPrefs.cart as CartItem[])
      }
    } catch (error) {
      // console.error("Failed to load cart:", error)
      toast.error("Failed to load your cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      setProcessingQuantity(itemId)

      if (newQuantity < 1) {
        newQuantity = 1
      }

      // Update quantity for specific item
      const updatedCart = cartItems.map(item =>
        item.productId === itemId ? { ...item, quantity: newQuantity } : item
      )

      // Save to server
      await saveCart(updatedCart)

      // Update local state
      setCartItems(updatedCart)
      
      // Refresh cart context to update header badge
      await refreshCart()
      
      toast.success("Cart updated")
    } catch (error) {
      // console.error("Failed to update cart:", error)
      toast.error("Failed to update cart. Please try again.")

      // Refresh cart state from server in case of error
      fetchCart()
    } finally {
      setProcessingQuantity(null)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      setProcessingQuantity(itemId)

      // Create a new array without the item to remove
      const updatedCart = cartItems.filter(item => item.productId !== itemId)

      // Save to server
      await saveCart(updatedCart)

      // Update local state
      setCartItems(updatedCart)
      
      // Refresh cart context to update header badge
      await refreshCart()
      
      toast.success("Item removed from cart")
    } catch (error) {
      // console.error("Failed to remove item:", error)
      toast.error("Failed to remove item. Please try again.")

      // Refresh cart state from server in case of error
      fetchCart()
    } finally {
      setProcessingQuantity(null)
    }
  }
  // Format price based on currency
  const formatPrice = (price: number): string => {
    const currencyData = currencyConfig[selectedCountry.currency] || currencyConfig.INR;
    return currencyData.position === 'before'
      ? `${currencyData.symbol}${price.toFixed(2)}`
      : `${price.toFixed(2)} ${currencyData.symbol}`;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getFormattedTotal = () => {
    return formatPrice(calculateTotal());
  };

  const isDigitalOnly = cartItems.length > 0 && cartItems.every(item => item.type === 'plan');

  const handleConfirmCart = async () => {
    try {
      setProcessingCheckout(true);

      if (!cartItems.length) {
        toast.error("Your cart is empty");
        return;
      }

      if (selectedCountry.code !== 'IN') {
        toast.error("Payment gateway is currently available only in India");
        return;
      }

      // Navigate to address step
      router.push(`/checkout/address?source=cart`);
    } catch (error) {
      toast.error("Failed to proceed. Please try again.");
    } finally {
      setProcessingCheckout(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add items to your cart to proceed to checkout</p>
            <Button onClick={() => router.push("/store")}>
              Browse Store
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Cart Review */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-smart-teal text-white text-sm font-bold">1</span>
            <CardTitle className="text-2xl">Review Your Cart</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-start gap-4 p-4 border rounded-lg">
                {item.image && (
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.color && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {item.color}
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <span className="ml-2 font-semibold">{item.quantity}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Unit Price:</span>
                      <span className="ml-2 font-semibold">{formatPrice(item.price)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-2 font-bold text-lg">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-r-none"
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      disabled={processingQuantity === item.productId || item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                      className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      disabled={processingQuantity === item.productId}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-l-none"
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      disabled={processingQuantity === item.productId}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.productId)}
                    disabled={processingQuantity === item.productId}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{getFormattedTotal()}</span>
            </div>
            {isDigitalOnly && selectedCountry.code === 'IN' && (
              <div className="text-xs text-green-600">
                * Early Bird Discount applied on applicable items
              </div>
            )}
            <div className="flex justify-between font-bold text-xl pt-2 border-t">
              <span>Total</span>
              <span className="text-smart-teal">{getFormattedTotal()}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-smart-teal hover:bg-smart-teal/90 text-white"
            onClick={handleConfirmCart}
            disabled={processingCheckout || !cartItems.length}
            size="lg"
          >
            {processingCheckout ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></span>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Confirm & Continue
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
