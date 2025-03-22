"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getUserPreferences, saveCart, saveOrder } from "@/app/_actions/user-preferences"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ShoppingCart, Trash } from "lucide-react"
import Image from "next/image"

// Ensure this matches the schema in user-preferences.ts
interface CartItem {
  productId: string
  name: string
  price: number
  type: string
  quantity: number
  color?: string
  image?: string
}

export default function CartItems() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processingCheckout, setProcessingCheckout] = useState(false)

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const userPrefs = await getUserPreferences()
        if (userPrefs?.cart) {
          setCartItems(userPrefs.cart as CartItem[])
        }
      } catch (error) {
        console.error("Failed to load cart items:", error)
        toast.error("Failed to load your cart. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadCartItems()
  }, [])

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const updatedItems = [...cartItems]
    updatedItems[index].quantity = newQuantity
    setCartItems(updatedItems)
    
    // Save to server
    saveCart(updatedItems).catch(error => {
      console.error("Failed to update cart:", error)
      toast.error("Failed to update cart. Please try again.")
    })
  }

  const handleRemoveItem = async (index: number) => {
    try {
      const updatedItems = [...cartItems]
      updatedItems.splice(index, 1)
      setCartItems(updatedItems)
      
      await saveCart(updatedItems)
      toast.success("Item removed from cart")
    } catch (error) {
      console.error("Failed to remove item:", error)
      toast.error("Failed to remove item. Please try again.")
    }
  }

  const handleCheckout = async () => {
    try {
      setProcessingCheckout(true)
      
      // Create an order from the cart items
      const order = {
        items: cartItems,
        total: calculateTotal(),
        status: "pending",
        createdAt: new Date().toISOString(),
      }
      
      // Save the order
      await saveOrder(order)
      
      // Clear the cart
      await saveCart([])
      setCartItems([])
      
      toast.success("Order placed successfully!")
      router.push("/orders")
    } catch (error) {
      console.error("Checkout failed:", error)
      toast.error("Checkout failed. Please try again.")
    } finally {
      setProcessingCheckout(false)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

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
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add items to your cart to get started</p>
            <Button onClick={() => router.push("/store")}>
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Cart Items ({cartItems.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex flex-col md:flex-row gap-4 pb-4">
                <div className="w-full md:w-24 h-24 bg-gray-100 rounded relative overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} {item.color && `• ${item.color}`}
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="w-20">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(index, parseInt(e.target.value) || 1)}
                        className="h-8"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      className="ml-auto"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleCheckout}
              disabled={processingCheckout}
            >
              {processingCheckout ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></span>
                  Processing...
                </span>
              ) : (
                "Proceed to Checkout"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 