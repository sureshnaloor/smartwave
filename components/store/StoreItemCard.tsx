"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Heart, ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import { saveCart, saveWishlist } from "@/app/_actions/user-preferences"

interface StoreItemCardProps {
  id: string
  name: string
  price: number
  type: string
  description: string
  color?: string[]
  image?: string
  showColorSelector?: boolean
  onAddToCart?: (item: any) => void
  onAddToWishlist?: (item: any) => void
}

export default function StoreItemCard({
  id,
  name,
  price,
  type,
  description,
  color,
  image,
  showColorSelector = false,
  onAddToCart,
  onAddToWishlist
}: StoreItemCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(color && color.length > 0 ? color[0] : undefined)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }

  const handleColorChange = (value: string) => {
    setSelectedColor(value)
  }

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true)
      
      const cartItem = {
        productId: id,
        name,
        price,
        type,
        quantity,
        color: selectedColor,
        image
      }
      
      // If an onAddToCart callback was provided, use it
      if (onAddToCart) {
        onAddToCart(cartItem)
      } else {
        // Otherwise use the server action directly
        await saveCart([cartItem])
      }
      
      toast.success(`Added ${name} to cart!`)
    } catch (error) {
      console.error("Failed to add to cart:", error)
      toast.error("Failed to add item to cart. Please try again.")
    } finally {
      setAddingToCart(false)
    }
  }

  const handleAddToWishlist = async () => {
    try {
      setAddingToWishlist(true)
      
      const wishlistItem = {
        productId: id,
        name,
        price,
        type,
        quantity: 1,
        color: selectedColor,
        image
      }
      
      // If an onAddToWishlist callback was provided, use it
      if (onAddToWishlist) {
        onAddToWishlist(wishlistItem)
      } else {
        // Otherwise use the server action directly
        await saveWishlist([wishlistItem])
      }
      
      toast.success(`Added ${name} to wishlist!`)
    } catch (error) {
      console.error("Failed to add to wishlist:", error)
      toast.error("Failed to add item to wishlist. Please try again.")
    } finally {
      setAddingToWishlist(false)
    }
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {image && (
        <div className="relative h-48 w-full">
          <Image 
            src={image} 
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>${price.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-500">{description}</p>
        
        <div className="mt-6 space-y-4">
          {showColorSelector && color && color.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select 
                value={selectedColor} 
                onValueChange={handleColorChange}
              >
                <SelectTrigger id="color">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {color.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          className="flex-1" 
          onClick={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <span className="flex items-center">
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></span>
              Adding...
            </span>
          ) : (
            <span className="flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </span>
          )}
        </Button>
        <Button 
          variant="outline"
          onClick={handleAddToWishlist}
          disabled={addingToWishlist}
        >
          {addingToWishlist ? (
            <span className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full"></span>
          ) : (
            <Heart className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  )
} 