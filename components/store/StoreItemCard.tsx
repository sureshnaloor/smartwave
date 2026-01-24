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
  colorTheme?: "teal" | "silver" | "gold" | "orange" | "blue"
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
  priceKeys,
  colorTheme
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
  let originalUnitPrice: number | null = null;
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
      originalUnitPrice = annualPrice; // Before discounts
      periodLabel = "/year";
    } else {
      // 5 Year or Perpetual
      if (isPerpetual) {
        finalPrice = secondaryPrice;
        unitPriceDisplay = secondaryPrice;
        originalUnitPrice = secondaryPrice;
        periodLabel = " one-time";
        discountInfo = "Lifetime Access";
      } else {
        // 5 Year Plan
        finalPrice = secondaryPrice * 5;
        unitPriceDisplay = secondaryPrice; // Display the annual-equivalent rate
        originalUnitPrice = annualPrice; // Compare 5-year unit rate to 1-year unit rate
        periodLabel = "/year";
        discountInfo = "Special 5-Year Rate";
      }
    }

    // India Discount Logic
    const isIndia = selectedCountry.currency === 'INR';
    if (isIndia) {
      // Apply 50% discount to everything for India
      finalPrice = Math.round(finalPrice * 0.5);
      unitPriceDisplay = Math.round(unitPriceDisplay * 0.5);

      const earlyBirdText = "50% Early Bird India Discount";
      discountInfo = discountInfo ? `${discountInfo} + ${earlyBirdText}` : earlyBirdText;
    }

    // If unitPriceDisplay is less than originalUnitPrice, we show the original
    if (originalUnitPrice && unitPriceDisplay >= originalUnitPrice) {
      originalUnitPrice = null; // No discount to show
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
    unitPriceDisplay = convertedBasePrice * (1 - discount);

    if (discount > 0) {
      originalUnitPrice = convertedBasePrice;
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


  // Determine theme classes
  const themeClasses = {
    teal: "bg-teal-50/30 dark:bg-teal-900/10 border-teal-200 dark:border-teal-800 shadow-teal-500/5",
    silver: "bg-slate-50/50 dark:bg-slate-800/20 border-slate-300 dark:border-slate-700 shadow-slate-500/5",
    gold: "bg-amber-50/50 dark:bg-amber-900/10 border-amber-300 dark:border-amber-800 shadow-amber-500/5",
    orange: "bg-orange-50/30 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800 shadow-orange-500/5",
    blue: "bg-blue-50/30 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-blue-500/5",
  };

  const selectedTheme = colorTheme ? themeClasses[colorTheme] : "border-gray-200 dark:border-gray-800";

  return (
    <Card className={`overflow-hidden flex flex-col h-full border-2 transition-all duration-500 hover:scale-[1.01] ${selectedTheme}`}>
      {/* Visual Header / Image */}
      {image && (
        <div className="relative h-48 w-full border-b dark:border-white/5">
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
        <div className={`h-40 w-full flex items-center justify-center border-b dark:border-white/5 bg-white dark:bg-zinc-900`}>
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-inner
            ${colorTheme === 'teal' ? 'bg-teal-100 text-teal-600 dark:bg-teal-500/20' :
              colorTheme === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20' :
                colorTheme === 'silver' ? 'bg-slate-100 text-slate-600 dark:bg-slate-500/20' :
                  colorTheme === 'gold' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20' :
                    colorTheme === 'orange' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20' :
                      'bg-gray-100 text-gray-400 dark:bg-white/5'}
          `}>
            {type === 'card' ? '💳' : '📱'}
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="flex flex-col">
          {/* Price Display */}
          <div className="flex items-baseline gap-2 flex-wrap">
            {originalUnitPrice && (
              <span className="text-sm text-gray-400 line-through font-medium tabular-nums">
                {formatMoney(originalUnitPrice)}
              </span>
            )}
            <span className={`text-2xl font-black tabular-nums transition-colors duration-300 ${originalUnitPrice ? 'text-green-600 dark:text-emerald-400' : 'text-primary'}`}>
              {formatMoney(unitPriceDisplay)}
            </span>
            <span className="text-xs text-muted-foreground font-bold tracking-tight uppercase">
              {type === 'card' ? '/each' : '/year'}
            </span>
          </div>

          {/* Discount Tag */}
          {discountInfo && (
            <div className="flex items-center gap-1.5 mt-1.5 px-2.5 py-1 bg-green-50 dark:bg-emerald-500/10 border border-green-100 dark:border-emerald-500/20 rounded-full w-fit">
              <Tag className="w-3 h-3 text-green-600 dark:text-emerald-400" />
              <span className="text-[10px] font-black text-green-700 dark:text-emerald-300 uppercase tracking-widest leading-none">
                {discountInfo}
              </span>
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
          <div className="flex flex-col gap-2 bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl mt-6 border border-gray-100 dark:border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {type === 'plan' ? (
                  billingCycle === 'annual'
                    ? 'Billed Annually'
                    : (priceKeys?.fiveYear?.includes('perpetual') ? 'Lifetime Access' : 'Billed every 5 years')
                ) : 'Subtotal'}
              </span>
              {originalUnitPrice && (
                <span className="text-[10px] font-bold bg-green-500 text-white px-2 py-0.5 rounded-full uppercase">Discounted</span>
              )}
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
                {formatMoney(finalPrice)}
              </span>
              <span className="text-xs font-bold text-muted-foreground uppercase">{periodLabel}</span>
            </div>
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