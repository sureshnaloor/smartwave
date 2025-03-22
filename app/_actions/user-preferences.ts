"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { DEFAULT_CURRENCY } from "@/lib/currencyTypes";

// Color validation schema
const colorSchema = z.enum(["black", "blue", "silver", "green"]);

// Currency code schema
const currencySchema = z.string().min(3).max(3).default(DEFAULT_CURRENCY.code);

// Item validation schemas
const productSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  currency: currencySchema.optional(), // Currency code (USD, EUR, etc.)
  type: z.string(),
  color: z.union([z.string(), z.array(z.string())]).optional(),
  quantity: z.number().int().positive().default(1),
  image: z.string().optional(),
});

// Cart item schema (product + quantity)
const cartItemSchema = productSchema;

// Wishlist item schema
const wishlistItemSchema = productSchema;

// Order schema
const orderSchema = z.object({
  id: z.string(),
  date: z.string(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  total: z.number().positive(),
  items: z.array(productSchema),
  shippingAddress: z.object({
    fullName: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

// Types based on schemas
export type Product = z.infer<typeof productSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type WishlistItem = z.infer<typeof wishlistItemSchema>;
export type Order = z.infer<typeof orderSchema>;

// User preferences structure
export type UserPreferences = {
  email: string;
  wishlist?: WishlistItem[];
  cart?: CartItem[];
  orders?: Order[];
  theme?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Get all user preferences from the database
 */
export async function getUserPreferences() {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { 
        success: false, 
        error: "User not authenticated",
        wishlist: [],
        cart: [],
        orders: []
      };
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Get userpreferences collection
    const collection = db.collection("userpreferences");
    
    // Find user preferences
    const userPreference = await collection.findOne<UserPreferences>(
      { email: session.user.email },
      { projection: { _id: 0 } }
    );
    
    if (!userPreference) {
      // No preferences found, return empty arrays
      return {
        success: true,
        wishlist: [],
        cart: [],
        orders: []
      };
    }
    
    // Return preferences or default to empty arrays
    return { 
      success: true, 
      wishlist: userPreference.wishlist || [],
      cart: userPreference.cart || [],
      orders: userPreference.orders || []
    };
  } catch (error) {
    console.error("Error getting user preferences:", error);
    return { 
      success: false, 
      error: "Failed to get user preferences",
      wishlist: [],
      cart: [],
      orders: []
    };
  }
}

/**
 * Save wishlist items to the database
 */
export async function saveWishlist(wishlistItems: WishlistItem[]) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "User not authenticated" };
    }

    // Validate wishlist
    const validationResult = z.array(wishlistItemSchema).safeParse(wishlistItems);
    if (!validationResult.success) {
      console.warn(`Invalid wishlist data`);
      return { 
        success: false, 
        error: "Invalid wishlist data" 
      };
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Get userpreferences collection
    const collection = db.collection("userpreferences");
    
    // Update wishlist
    const result = await collection.updateOne(
      { email: session.user.email },
      { 
        $set: { 
          wishlist: wishlistItems,
          updatedAt: new Date()
        },
        $setOnInsert: { 
          email: session.user.email,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    
    if (!result.acknowledged) {
      throw new Error("Database operation not acknowledged");
    }
    
    // Revalidate paths that might depend on wishlist
    revalidatePath("/profile");
    
    return { success: true, wishlist: wishlistItems };
  } catch (error) {
    console.error("Error saving wishlist:", error);
    return { success: false, error: "Failed to save wishlist" };
  }
}

/**
 * Save cart items to the database
 */
export async function saveCart(cartItems: CartItem[]) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "User not authenticated" };
    }

    // Validate cart
    const validationResult = z.array(cartItemSchema).safeParse(cartItems);
    if (!validationResult.success) {
      console.warn(`Invalid cart data`);
      return { 
        success: false, 
        error: "Invalid cart data" 
      };
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Get userpreferences collection
    const collection = db.collection("userpreferences");
    
    // Update cart
    const result = await collection.updateOne(
      { email: session.user.email },
      { 
        $set: { 
          cart: cartItems,
          updatedAt: new Date()
        },
        $setOnInsert: { 
          email: session.user.email,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    
    if (!result.acknowledged) {
      throw new Error("Database operation not acknowledged");
    }
    
    // Revalidate paths that might depend on cart
    revalidatePath("/profile");
    revalidatePath("/cart");
    
    return { success: true, cart: cartItems };
  } catch (error) {
    console.error("Error saving cart:", error);
    return { success: false, error: "Failed to save cart" };
  }
}

/**
 * Save order to the database
 */
export async function saveOrder(order: any) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "User not authenticated" };
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Get userpreferences collection
    const collection = db.collection("userpreferences");
    
    // Get current orders
    const userPreference = await collection.findOne<UserPreferences>(
      { email: session.user.email },
      { projection: { _id: 0, orders: 1 } }
    );
    
    const currentOrders = userPreference?.orders || [];
    
    // Create a new order with an ID
    const newOrder = {
      ...order,
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
    };
    
    // Add new order to the list
    const newOrders = [...currentOrders, newOrder];
    
    // Update orders
    const result = await collection.updateOne(
      { email: session.user.email },
      { 
        $set: { 
          orders: newOrders,
          updatedAt: new Date()
        },
        $setOnInsert: { 
          email: session.user.email,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    
    if (!result.acknowledged) {
      throw new Error("Database operation not acknowledged");
    }
    
    // Revalidate paths that might depend on orders
    revalidatePath("/profile");
    revalidatePath("/orders");
    
    return { success: true, order: newOrder };
  } catch (error) {
    console.error("Error saving order:", error);
    return { success: false, error: "Failed to save order" };
  }
}

/**
 * Get available store items
 */
export async function getStoreItems() {
  try {
    // Get user's preferred currency from cookie
    const cookieStore = cookies();
    const countryCookie = cookieStore.get('userCountry');
    const currencyCookie = cookieStore.get('userCurrency');
    
    let currency;
    
    // First check if we have a saved currency preference
    if (currencyCookie && currencyCookie.value) {
      try {
        // Try to parse the saved currency JSON
        currency = JSON.parse(currencyCookie.value);
      } catch (e) {
        console.error("Failed to parse currency cookie:", e);
      }
    }
    
    // If no valid currency was found in cookie, try to get it from country
    if (!currency && countryCookie && countryCookie.value) {
      const { getCurrencyForCountry } = await import('@/lib/currencyMapper');
      currency = await getCurrencyForCountry(countryCookie.value);
    }
    
    // If still no currency, use default
    if (!currency) {
      const { DEFAULT_CURRENCY } = await import('@/lib/currencyTypes');
      currency = DEFAULT_CURRENCY;
    }
    
    // Mock data for the store items (prices in base currency)
    const storeData = {
      cards: [
        {
          id: "pvc-card",
          name: "Standard PVC Business Card",
          price: currency.rates.pvc,
          type: "pvc_card",
          description: "Durable plastic business cards that stand out from paper cards.",
          image: "/images/pvc-card.jpg"
        },
        {
          id: "nfc-card",
          name: "NFC Business Card",
          price: currency.rates.nfc,
          type: "nfc_card",
          description: "Tap to share your contact information and connect instantly.",
          image: "/images/nfc-card.jpg"
        },
        {
          id: "color-nfc-card",
          name: "Color NFC Business Card",
          price: currency.rates.color,
          type: "color_nfc_card",
          description: "Colorful NFC business cards that stand out and connect.",
          color: ["black", "white", "blue", "red", "green"],
          image: "/images/color-nfc-card.jpg"
        },
        {
          id: "metallic-card",
          name: "Metallic Business Card",
          price: currency.rates.premium,
          type: "metallic_card",
          description: "Premium metal cards that make a lasting impression.",
          image: "/images/metallic-card.jpg"
        }
      ],
      editPlans: [
        {
          id: "basic-edit",
          name: "Basic Edit Plan",
          price: currency.rates.singleEdit,
          type: "basic_edit",
          description: "Simple editing for contact information and basic design adjustments.",
          image: "/images/basic-edit.jpg"
        },
        {
          id: "standard-edit",
          name: "Standard Edit Plan",
          price: currency.rates.fiveEdits,
          type: "standard_edit",
          description: "Full design editing with up to 3 revisions and professional design assistance.",
          image: "/images/standard-edit.jpg"
        },
        {
          id: "premium-edit",
          name: "Premium Edit Plan",
          price: currency.rates.annual,
          type: "premium_edit",
          description: "Unlimited revisions with priority support and custom design consultations.",
          image: "/images/premium-edit.jpg"
        }
      ]
    };

    // Add currency information to each item
    const processedData = {
      cards: storeData.cards.map(card => ({ 
        ...card, 
        currency: currency.code
      })),
      editPlans: storeData.editPlans.map(plan => ({ 
        ...plan, 
        currency: currency.code
      }))
    };

    return processedData;
  } catch (error) {
    console.error("Error getting store items:", error);
    // Return original data structure with default currency if there's an error
    const { DEFAULT_CURRENCY } = await import('@/lib/currencyTypes');
    
    return {
      cards: [
        {
          id: "pvc-card",
          name: "Standard PVC Business Card",
          price: DEFAULT_CURRENCY.rates.pvc,
          currency: DEFAULT_CURRENCY.code,
          type: "pvc_card",
          description: "Durable plastic business cards that stand out from paper cards.",
          image: "/images/pvc-card.jpg"
        },
        // Other cards with default prices
      ],
      editPlans: [
        // Edit plans with default prices
      ]
    };
  }
}

/**
 * Add item to wishlist
 */
export async function addToWishlist(formData: FormData) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "User not authenticated" };
    }

    // Extract item data from form
    const itemJson = formData.get("item") as string;
    
    if (!itemJson) {
      return { 
        success: false, 
        error: "Item data is required" 
      };
    }
    
    let item: WishlistItem;
    try {
      item = JSON.parse(itemJson);
    } catch (e) {
      return { 
        success: false, 
        error: "Invalid item format" 
      };
    }

    // Validate item
    const validationResult = wishlistItemSchema.safeParse(item);
    if (!validationResult.success) {
      console.warn(`Invalid item data`);
      return { 
        success: false, 
        error: "Invalid item data" 
      };
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Get userpreferences collection
    const collection = db.collection("userpreferences");
    
    // Get current wishlist
    const userPreference = await collection.findOne<UserPreferences>(
      { email: session.user.email },
      { projection: { _id: 0, wishlist: 1 } }
    );
    
    const currentWishlist = userPreference?.wishlist || [];
    
    // Check if item already exists
    const itemExists = currentWishlist.some(i => i.productId === item.productId);
    
    if (itemExists) {
      return { 
        success: true, 
        message: "Item already in wishlist",
        wishlist: currentWishlist 
      };
    }
    
    // Add item to wishlist
    const newWishlist = [...currentWishlist, item];
    
    // Update wishlist
    const result = await collection.updateOne(
      { email: session.user.email },
      { 
        $set: { 
          wishlist: newWishlist,
          updatedAt: new Date()
        },
        $setOnInsert: { 
          email: session.user.email,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    
    if (!result.acknowledged) {
      throw new Error("Database operation not acknowledged");
    }
    
    // Revalidate paths that might depend on wishlist
    revalidatePath("/profile");
    
    return { success: true, wishlist: newWishlist };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return { success: false, error: "Failed to add item to wishlist" };
  }
}

/**
 * Add item to cart
 */
export async function addToCart(formData: FormData) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "User not authenticated" };
    }

    // Extract item data from form
    const itemJson = formData.get("item") as string;
    
    if (!itemJson) {
      return { 
        success: false, 
        error: "Item data is required" 
      };
    }
    
    let item: CartItem;
    try {
      item = JSON.parse(itemJson);
    } catch (e) {
      return { 
        success: false, 
        error: "Invalid item format" 
      };
    }

    // Validate item
    const validationResult = cartItemSchema.safeParse(item);
    if (!validationResult.success) {
      console.warn(`Invalid item data`);
      return { 
        success: false, 
        error: "Invalid item data" 
      };
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Get userpreferences collection
    const collection = db.collection("userpreferences");
    
    // Get current cart
    const userPreference = await collection.findOne<UserPreferences>(
      { email: session.user.email },
      { projection: { _id: 0, cart: 1 } }
    );
    
    const currentCart = userPreference?.cart || [];
    
    // Check if item already exists
    const existingItemIndex = currentCart.findIndex(i => i.productId === item.productId);
    
    let newCart;
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      newCart = [...currentCart];
      newCart[existingItemIndex].quantity += item.quantity || 1;
    } else {
      // Add new item
      newCart = [...currentCart, item];
    }
    
    // Update cart
    const result = await collection.updateOne(
      { email: session.user.email },
      { 
        $set: { 
          cart: newCart,
          updatedAt: new Date()
        },
        $setOnInsert: { 
          email: session.user.email,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    
    if (!result.acknowledged) {
      throw new Error("Database operation not acknowledged");
    }
    
    // Revalidate paths that might depend on cart
    revalidatePath("/profile");
    
    return { success: true, cart: newCart };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: "Failed to add item to cart" };
  }
}

/**
 * Create order from cart
 */
export async function createOrderFromCart(formData: FormData) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "User not authenticated" };
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Get userpreferences collection
    const collection = db.collection("userpreferences");
    
    // Get current cart
    const userPreference = await collection.findOne<UserPreferences>(
      { email: session.user.email },
      { projection: { _id: 0, cart: 1, orders: 1 } }
    );
    
    const currentCart = userPreference?.cart || [];
    
    if (currentCart.length === 0) {
      return { 
        success: false, 
        error: "Cart is empty" 
      };
    }
    
    // Calculate total
    const total = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create new order
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
      status: "pending",
      total,
      items: currentCart
    };
    
    // Add shipping info if provided
    const shippingJson = formData.get("shipping") as string;
    if (shippingJson) {
      try {
        order.shippingAddress = JSON.parse(shippingJson);
      } catch (e) {
        // Ignore shipping if invalid
      }
    }
    
    // Get current orders
    const currentOrders = userPreference?.orders || [];
    
    // Add new order
    const newOrders = [...currentOrders, order];
    
    // Update orders and clear cart
    const result = await collection.updateOne(
      { email: session.user.email },
      { 
        $set: { 
          orders: newOrders,
          cart: [], // Clear the cart
          updatedAt: new Date()
        },
        $setOnInsert: { 
          email: session.user.email,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    
    if (!result.acknowledged) {
      throw new Error("Database operation not acknowledged");
    }
    
    // Revalidate paths that might depend on orders and cart
    revalidatePath("/profile");
    
    return { success: true, order };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
} 