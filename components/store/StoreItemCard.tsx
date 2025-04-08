"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MinusIcon, PlusIcon, ShoppingCart, Heart, Check } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getUserPreferences, saveCart, saveWishlist } from "@/app/_actions/user-preferences"
import { CurrencyInfo, DEFAULT_CURRENCY } from "@/lib/currencyTypes"
import PriceDisplay from '@/components/PriceDisplay';
import { useCountry } from '@/context/CountryContext';
import { currencyConfig } from '@/lib/currencyConfig';

interface StoreItemCardProps {
  id: string
  name: string
  price: number
  type: string
  description: string
  color?: string[]
  image?: string
  currency?: string
}

export default function StoreItemCard({
  id,
  name,
  price,
  type,
  description,
  color,
  image,
  currency = DEFAULT_CURRENCY.code
}: StoreItemCardProps) {
  const router = useRouter()
  const { selectedCountry } = useCountry();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    Array.isArray(color) && color.length > 0 ? color[0] : undefined
  )
  const [loadingCart, setLoadingCart] = useState(false)
  const [loadingWishlist, setLoadingWishlist] = useState(false)
  const [isInCart, setIsInCart] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const formatPrice = (price: number): string => {
    const currencyData = currencyConfig[selectedCountry.currency] || currencyConfig.USD;
    return currencyData.position === 'before'
      ? `${currencyData.symbol}${price.toFixed(2)}`
      : `${price.toFixed(2)} ${currencyData.symbol}`;
  };

  // Check if item is already in cart or wishlist
  useEffect(() => {
    const checkItemStatus = async () => {
      try {
        const userPrefs = await getUserPreferences()
        
        // Check cart
        const inCart = (userPrefs?.cart || []).some(item => 
          item.productId === id && 
          (!selectedColor || item.color === selectedColor)
        )
        setIsInCart(inCart)
        
        // Check wishlist
        const inWishlist = (userPrefs?.wishlist || []).some(item => 
          item.productId === id && 
          (!selectedColor || item.color === selectedColor)
        )
        setIsInWishlist(inWishlist)
      } catch (error) {
        // console.error("Error checking item status:", error)
      } finally {
        setInitialLoading(false)
      }
    }
    
    checkItemStatus()
  }, [id, selectedColor])

  // Also update item status when color changes
  useEffect(() => {
    if (!initialLoading) {
      const checkItemStatus = async () => {
        try {
          const userPrefs = await getUserPreferences()
          
          // Check cart
          const inCart = (userPrefs?.cart || []).some(item => 
            item.productId === id && 
            (!selectedColor || item.color === selectedColor)
          )
          setIsInCart(inCart)
          
          // Check wishlist
          const inWishlist = (userPrefs?.wishlist || []).some(item => 
            item.productId === id && 
            (!selectedColor || item.color === selectedColor)
          )
          setIsInWishlist(inWishlist)
        } catch (error) {
          // console.error("Error checking item status:", error)
        }
      }
      
      checkItemStatus()
    }
  }, [selectedColor, initialLoading, id])

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity)
    }
  }

  const handleColorChange = (value: string) => {
    setSelectedColor(value)
  }

  const handleAddToCart = async () => {
    try {
      setLoadingCart(true)
      
      // Get current cart
      const userPrefs = await getUserPreferences()
      const currentCart = userPrefs?.cart || []
      
      // Create new item object
      const cartItem = {
        productId: id,
        name,
        price,
        currency: selectedCountry.currency,
        type,
        description,
        quantity,
        color: selectedColor,
        image
      }
      
      // Check if item already exists in cart
      const existingItemIndex = currentCart.findIndex(item => 
        item.productId === id && 
        item.color === selectedColor
      )
      
      let updatedCart
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        updatedCart = [...currentCart]
        updatedCart[existingItemIndex].quantity += quantity
      } else {
        // Add new item to cart
        updatedCart = [...currentCart, cartItem]
      }
      
      // Save updated cart
      await saveCart(updatedCart)
      
      setIsInCart(true)
      toast.success(`Added ${name} to cart!`)
      router.refresh()
    } catch (error) {
      // console.error("Failed to add to cart:", error)
      toast.error("Failed to add item to cart. Please try again.")
    } finally {
      setLoadingCart(false)
    }
  }

  const handleAddToWishlist = async () => {
    try {
      setLoadingWishlist(true)
      
      // Get current wishlist
      const userPrefs = await getUserPreferences()
      const currentWishlist = userPrefs?.wishlist || []
      
      // Create new item object
      const wishlistItem = {
        productId: id,
        name,
        price,
        currency: selectedCountry.currency,
        type,
        description,
        quantity: 1,
        color: selectedColor,
        image
      }
      
      // Check if item already exists in wishlist
      const itemExists = currentWishlist.some(item => 
        item.productId === id && 
        item.color === selectedColor
      )
      
      if (itemExists) {
        toast.info("Item already in wishlist")
        return
      }
      
      // Add new item to wishlist
      const updatedWishlist = [...currentWishlist, wishlistItem]
      
      // Save updated wishlist
      await saveWishlist(updatedWishlist)
      
      setIsInWishlist(true)
      toast.success(`Added ${name} to wishlist!`)
      router.refresh()
    } catch (error) {
      // console.error("Failed to add to wishlist:", error)
      toast.error("Failed to add item to wishlist. Please try again.")
    } finally {
      setLoadingWishlist(false)
    }
  }

 

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      {image && (
        <div className="relative h-48 w-full">
          <Image 
            src={image} 
            alt={name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        <p className="text-sm font-medium">{formatPrice(price)}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-500 mb-4">{description}</p>

        {/* Color selector */}
        {color && Array.isArray(color) && color.length > 0 && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="color">Color</Label>
            <RadioGroup
              id="color"
              value={selectedColor}
              onValueChange={handleColorChange}
              className="flex gap-2 flex-wrap"
            >
              {color.map((c) => (
                <div key={c} className="flex items-center space-x-2">
                  <RadioGroupItem value={c} id={`color-${c}`} />
                  <Label htmlFor={`color-${c}`} className="capitalize">{c}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Quantity selector */}
        <div className="mt-4 space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <div className="flex items-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <MinusIcon className="h-3 w-3" />
            </Button>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="99"
              className="h-8 w-14 mx-2 text-center"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 99}
            >
              <PlusIcon className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          variant={isInCart ? "secondary" : "default"}
          size="sm" 
          className="flex-1"
          onClick={handleAddToCart}
          disabled={loadingCart}
        >
          {loadingCart ? (
            <span className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full" />
          ) : isInCart ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              In Cart
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
        <Button
          variant={isInWishlist ? "secondary" : "outline"}
          size="sm"
          onClick={handleAddToWishlist}
          disabled={loadingWishlist || isInCart || isInWishlist}
          title={isInCart ? "Item already in cart" : isInWishlist ? "Item already in wishlist" : "Add to wishlist"}
          className={isInCart ? "opacity-50 cursor-not-allowed" : ""}
        >
          {loadingWishlist ? (
            <span className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full" />
          ) : (
            <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}