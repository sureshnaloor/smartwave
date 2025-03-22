"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserPreferences, saveWishlist, saveCart } from "@/app/_actions/user-preferences"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Heart, ShoppingBag, Trash, Check } from "lucide-react"
import Image from "next/image"

// Ensure this matches the schema in user-preferences.ts
interface WishlistItem {
  productId: string
  name: string
  price: number
  type: string
  quantity: number
  color?: string
  image?: string
}

interface CartItem extends WishlistItem {} 

export default function WishlistItems() {
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processingItem, setProcessingItem] = useState<string | null>(null)

  const fetchUserData = async () => {
    try {
      const userPrefs = await getUserPreferences()
      if (userPrefs?.wishlist) {
        setWishlistItems(userPrefs.wishlist as WishlistItem[])
      }
      if (userPrefs?.cart) {
        setCartItems(userPrefs.cart as CartItem[])
      }
    } catch (error) {
      console.error("Failed to load user data:", error)
      toast.error("Failed to load your data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleRemoveItem = async (productId: string) => {
    try {
      setProcessingItem(productId)
      
      // Create a new array without the item to remove
      const updatedItems = wishlistItems.filter(item => item.productId !== productId)
      
      // Update local state
      setWishlistItems(updatedItems)
      
      // Save to server
      await saveWishlist(updatedItems)
      toast.success("Item removed from wishlist")
    } catch (error) {
      console.error("Failed to remove item:", error)
      toast.error("Failed to remove item. Please try again.")
      
      // Refresh wishlist state from server on error
      fetchUserData()
    } finally {
      setProcessingItem(null)
    }
  }

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      setProcessingItem(item.productId)
      
      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(cartItem => 
        cartItem.productId === item.productId && 
        cartItem.color === item.color
      )
      
      let updatedCart
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        updatedCart = [...cartItems]
        updatedCart[existingItemIndex].quantity += 1
        toast.info(`Increased quantity of ${item.name} in cart!`)
      } else {
        // Add new item to cart (ensure it has quantity)
        const cartItem = { ...item, quantity: 1 }
        updatedCart = [...cartItems, cartItem]
        toast.success(`Added ${item.name} to cart!`)
      }
      
      // Save updated cart
      await saveCart(updatedCart)
      
      // Update local cart state
      setCartItems(updatedCart)
      
      // Remove from wishlist
      const updatedWishlist = wishlistItems.filter(wishlistItem => 
        wishlistItem.productId !== item.productId || 
        wishlistItem.color !== item.color
      )
      
      // Save updated wishlist
      await saveWishlist(updatedWishlist)
      
      // Update local wishlist state
      setWishlistItems(updatedWishlist)
      
      router.refresh()
    } catch (error) {
      console.error("Failed to add to cart:", error)
      toast.error("Failed to add item to cart. Please try again.")
      
      // Refresh data from server on error
      fetchUserData()
    } finally {
      setProcessingItem(null)
    }
  }

  // Check if an item is in the cart
  const isInCart = (item: WishlistItem) => {
    return cartItems.some(cartItem => 
      cartItem.productId === item.productId && 
      cartItem.color === item.color
    )
  }

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Add items to your wishlist to save them for later</p>
            <Button onClick={() => router.push("/store")}>
              Browse Store
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlistItems.map((item) => {
        const itemInCart = isInCart(item);
        
        return (
          <Card key={item.productId} className="overflow-hidden flex flex-col">
            {item.image && (
              <div className="relative h-48 w-full">
                <Image 
                  src={item.image} 
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-500">
                {item.color && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2 capitalize">
                    {item.color}
                  </span>
                )}
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                variant={itemInCart ? "secondary" : "default"}
                size="sm" 
                className="flex-1"
                onClick={() => handleAddToCart(item)}
                disabled={processingItem === item.productId || itemInCart}
                title={itemInCart ? "Item already in cart" : "Add to cart"}
              >
                {processingItem === item.productId ? (
                  <span className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full" />
                ) : itemInCart ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    In Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveItem(item.productId)}
                disabled={processingItem === item.productId}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  )
} 