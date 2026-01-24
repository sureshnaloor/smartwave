"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MinusIcon, PlusIcon, ShoppingCart, Heart, Check, Tag } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getUserPreferences, saveCart, saveWishlist } from "@/app/_actions/user-preferences"

import { useCountry } from '@/context/CountryContext';
import { currencyConfig, DEFAULT_CURRENCY } from '@/lib/currencyConfig';
import { useCart } from '@/context/CartContext';

interface StoreItemCardProps {
  id: string
  name: string
  price: number
  type: string
  description: string
  color?: string[]
  image?: string
  currency?: string
  features?: string[]
  category?: string
  priceKeys?: {
    annual: string;
    fiveYear?: string; // or perpetual
  }
}

export default function StoreItemCard({
  id,
  name,
  price, // Fallback base price or PVC price
  type,
  description,
  color,
  image,
  category,
  priceKeys
}: StoreItemCardProps) {
  const router = useRouter()
  const { selectedCountry } = useCountry();
  const { refreshCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [billingCycle, setBillingCycle] = useState<'annual' | 'five_year'>('annual');
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    Array.isArray(color) && color.length > 0 ? color[0] : undefined
  )
  const [loadingCart, setLoadingCart] = useState(false)
  const [loadingWishlist, setLoadingWishlist] = useState(false)
  const [isInCart, setIsInCart] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // -- Prcing Logic --
  // Helper to get rate from config
  const getRate = (key: string) => {
    const rates = currencyConfig[selectedCountry.currency]?.rates || currencyConfig.USD.rates;
    return rates[key as keyof typeof rates] || 0;
  };

  const getConvertedPrice = (basePrice: number) => {
    let multiplier = 1;
    const curr = selectedCountry.currency;
    if (curr === 'SAR' || curr === 'AED') multiplier = 3.75;
    else if (curr === 'INR') multiplier = 75;
    else if (curr === 'BHD') multiplier = 0.375;
    else multiplier = 1;
    return basePrice * multiplier;
  };

  const displayCurrency = selectedCountry.currency;

  const formatMoney = (amount: number) => {
    return `${amount.toFixed(2)} ${displayCurrency}`;
  };

  const convertedBasePrice = getConvertedPrice(price);

  // Calculate Final Price
  let finalPrice = convertedBasePrice;
  let unitPriceDisplay = convertedBasePrice;
  let discountInfo: string | null = null;
  let periodLabel = "";

  if (type === 'plan' && priceKeys) {
    // Plan Logic: Annual vs 5-Year
    const annualPrice = getRate(priceKeys.annual);
    const secondaryPrice = priceKeys.fiveYear ? getRate(priceKeys.fiveYear) : 0;

    // Check if second option is "Perpetual" or "5 Year"
    const isPerpetual = priceKeys.fiveYear?.includes('perpetual');

    if (billingCycle === 'annual') {
      finalPrice = annualPrice;
      unitPriceDisplay = annualPrice;
      periodLabel = "/year";
    } else {
      // 5 Year or Perpetual
      if (isPerpetual) {
        finalPrice = secondaryPrice;
        unitPriceDisplay = secondaryPrice;
        periodLabel = " one-time";
        discountInfo = "Lifetime Access";
      } else {
        // 5 Year Plan
        // Rate in config is per year? Or total?
        // In plans.tsx I treated it as Unit Rate per Year.
        // "Billed as X for 5 years" -> Total = Rate * 5.
        finalPrice = secondaryPrice * 5;
        unitPriceDisplay = secondaryPrice; // Display the annual-equivalent rate
        periodLabel = "/year";
        discountInfo = "5-Year Plan"; // Tag
      }
    }

    // India Discount Logic
    const isIndia = selectedCountry.currency === 'INR';
    if (isIndia) {
      finalPrice = Math.round(finalPrice * 0.5); // 50% discount
      unitPriceDisplay = Math.round(unitPriceDisplay * 0.5);
      discountInfo = billingCycle === 'annual'
        ? "50% OFF (India Early Bird)"
        : (discountInfo ? `${discountInfo} + 50% India OFF` : "50% OFF");
    }

  } else {
    // Card Logic
    const getDiscountPercent = (qty: number) => {
      if (qty >= 50) return 0.40;
      if (qty >= 10) return 0.30;
      if (qty >= 5) return 0.20;
      return 0;
    };
    const discount = getDiscountPercent(quantity);
    finalPrice = convertedBasePrice * (1 - discount) * quantity;
    unitPriceDisplay = convertedBasePrice;
    if (discount > 0) {
      discountInfo = `${(discount * 100).toFixed(0)}% Bulk Discount`;
    }
  }
  // ------------------

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
    if (newQuantity >= 1 && newQuantity <= 999) {
      setQuantity(newQuantity)
    }
  }

  const handleColorChange = (value: string) => {
    setSelectedColor(value)
  }

  const handleAddToCart = async () => {
    try {
      setLoadingCart(true)

      const userPrefs = await getUserPreferences()
      const currentCart = userPrefs?.cart || []

      // For Plans, quantity is usually 1 (or we allow buying multiple licenses? default 1 for now)
      // For Cards, quantity is 'quantity'
      const finalQuantity = type === 'plan' ? 1 : quantity;

      const cartItem = {
        productId: id,
        name,
        price: finalPrice, // Save TOTAL price to cart for simplicity
        currency: selectedCountry.currency,
        type,
        billingCycle: type === 'plan' ? billingCycle : undefined,
        description,
        quantity: finalQuantity,
        color: selectedColor,
        image
      }

      const existingItemIndex = currentCart.findIndex(item =>
        item.productId === id &&
        item.color === selectedColor &&
        (item as any).billingCycle === cartItem.billingCycle // Separate items if billing cycle differs
      )

      let updatedCart
      if (existingItemIndex >= 0) {
        updatedCart = [...currentCart]
        updatedCart[existingItemIndex].quantity += finalQuantity
      } else {
        updatedCart = [...currentCart, cartItem]
      }

      await saveCart(updatedCart)

      setIsInCart(true)
      toast.success(`Added ${name} to cart!`)
      refreshCart(); // Refresh global count
      router.refresh()
    } catch (error) {
      toast.error("Failed to add item to cart. Please try again.")
    } finally {
      setLoadingCart(false)
    }
  }

  const handleAddToWishlist = async () => {
    try {
      setLoadingWishlist(true)
      const userPrefs = await getUserPreferences()
      const currentWishlist = userPrefs?.wishlist || []

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

      const itemExists = currentWishlist.some(item =>
        item.productId === id &&
        item.color === selectedColor
      )

      if (itemExists) {
        toast.info("Item already in wishlist")
        return
      }

      const updatedWishlist = [...currentWishlist, wishlistItem]
      await saveWishlist(updatedWishlist)
      setIsInWishlist(true)
      toast.success(`Added ${name} to wishlist!`)
      router.refresh()
    } catch (error) {
      toast.error("Failed to add item to wishlist. Please try again.")
    } finally {
      setLoadingWishlist(false)
    }
  }


  return (
    <Card className="overflow-hidden flex flex-col h-full border-gray-200 dark:border-gray-800">
      {/* Visual Header / Image */}
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
      {!image && (
        <div className={`h-32 w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900`}>
          <div className="text-4xl text-gray-400">
            {type === 'card' ? '💳' : '📱'}
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="flex flex-col">
          {/* Price Display */}
          {type === 'card' ? (
            <>
              {/* Card Pricing: Show Unit Price with strikethrough if discounted */}
              {discountInfo && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatMoney(convertedBasePrice)}/each
                </span>
              )}
              <span className="text-2xl font-bold text-primary">
                {formatMoney(convertedBasePrice * (1 - (quantity >= 50 ? 0.4 : quantity >= 10 ? 0.3 : quantity >= 5 ? 0.2 : 0)))}
                <span className="text-xs text-muted-foreground ml-1">/each</span>
              </span>
            </>
          ) : (
            <>
              {/* Plan Pricing: Show Monthly Price */}
              <span className="text-2xl font-bold text-primary">
                {formatMoney(unitPriceDisplay)}
                <span className="text-xs text-muted-foreground ml-1">/month</span>
              </span>
            </>
          )}

          {/* Discount Tag */}
          {discountInfo && (
            <div className="flex items-center text-xs text-green-600 font-medium mt-1">
              <Tag className="w-3 h-3 mr-1" />
              {discountInfo}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-gray-500">{description}</p>

        {/* Color selector (Cards Only) */}
        {type === 'card' && color && Array.isArray(color) && color.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="color" className="text-xs">Select Color</Label>
            <RadioGroup
              id="color"
              value={selectedColor}
              onValueChange={handleColorChange}
              className="flex gap-2 flex-wrap"
            >
              {color.map((c) => (
                <div key={c} className="flex items-center space-x-2">
                  <RadioGroupItem value={c} id={`color-${c}`} className="sr-only peer" />
                  <Label
                    htmlFor={`color-${c}`}
                    className={`
                        capitalize px-3 py-1 rounded-full border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                        ${selectedColor === c ? 'bg-primary text-primary-foreground border-primary hover:bg-primary' : 'bg-transparent'}
                    `}
                  >
                    {c.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Input Area: Quantity OR Billing Cycle */}
        <div className="space-y-2 pt-4 border-t">
          {type === 'card' ? (
            // -- Quantity Stepper for Cards --
            <>
              <Label htmlFor="quantity" className="text-xs">Quantity</Label>
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="999"
                    className="h-8 w-14 mx-1 text-center border-none shadow-none focus-visible:ring-0 px-0"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 999}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                {/* For cards, show total here */}
                {/* <div className="text-sm font-semibold">Total: {formatMoney(finalPrice)}</div> */}
              </div>
            </>
          ) : (
            // -- Billing Cycle for Plans --
            <>
              <Label className="text-xs">Billing Period</Label>
              <div className="grid grid-cols-2 gap-2">
                <div
                  onClick={() => setBillingCycle('annual')}
                  className={`cursor-pointer rounded-md border p-2 text-center text-sm transition-all
                     ${billingCycle === 'annual' ? 'border-primary bg-primary/5 font-semibold text-primary' : 'hover:bg-gray-50'}
                   `}
                >
                  1 Year
                </div>
                <div
                  onClick={() => setBillingCycle('five_year')}
                  className={`cursor-pointer rounded-md border p-2 text-center text-sm transition-all relative
                     ${billingCycle === 'five_year' ? 'border-primary bg-primary/5 font-semibold text-primary' : 'hover:bg-gray-50'}
                   `}
                >
                  {priceKeys && priceKeys.fiveYear?.includes('perpetual') ? 'Lifetime' : '5 Years'}
                  {priceKeys && !priceKeys.fiveYear?.includes('perpetual') && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      Best Value
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Total Price Display for Both */}
          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-3 rounded-md mt-4">
            <span className="text-sm text-gray-500">
              {type === 'plan' ? (
                billingCycle === 'annual'
                  ? 'Billed Annually'
                  : (priceKeys?.fiveYear?.includes('perpetual') ? 'One-time Payment' : 'Billed every 5 years')
              ) : 'Total'}
            </span>
            <span className="text-lg font-bold">
              {formatMoney(finalPrice)} <span className="text-xs font-normal text-muted-foreground">{periodLabel}</span>
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2 border-t mt-auto">
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