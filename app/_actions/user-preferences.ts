"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { currencyConfig, DEFAULT_CURRENCY } from "@/lib/currencyConfig"; // Add DEFAULT_CURRENCY import

// Color validation schema
const colorSchema = z.enum(["black", "blue", "silver", "green"]);

// Currency code schema
const currencySchema = z.string().min(3).max(3).default('USD'); // Use string literal instead of DEFAULT_CURRENCY

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
// Add to the UserPreferences type
export type ShippingAddress = {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  mobileNumber: string;  // Required
  phoneNumber?: string;  // Optional landline
  isDefault: boolean;
};

export type UserPreferences = {
  email: string;
  wishlist?: WishlistItem[];
  cart?: CartItem[];
  orders?: Order[];
  theme?: string;
  marketingEmails?: boolean;  // Add this
  promotionalEmails?: boolean;  // Add this
  createdAt?: Date;
  updatedAt?: Date;
  shippingAddresses?: ShippingAddress[];
};

// Add new function to manage shipping addresses
export async function saveShippingAddress(address: Omit<ShippingAddress, 'id'>) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "User not authenticated" };
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("userpreferences");

    const newAddress = {
      ...address,
      id: `addr_${Date.now()}`,
    };

    // First, check if the user has any shipping addresses
    const userPreference = await collection.findOne(
      { email: session.user.email },
      { projection: { shippingAddresses: 1 } }
    );

    let updateOperation;
    if (!userPreference?.shippingAddresses) {
      // If no shipping addresses exist, initialize the array
      updateOperation = {
        $set: { 
          shippingAddresses: [newAddress],
          updatedAt: new Date()
        },
        $setOnInsert: { 
          email: session.user.email,
          createdAt: new Date()
        }
      };
    } else {
      // If shipping addresses exist, push to the array
      updateOperation = {
        $push: { shippingAddresses: newAddress },
        $set: { updatedAt: new Date() }
      };
    }

    const result = await collection.updateOne(
      { email: session.user.email },
      updateOperation as any,
      { upsert: true }
    );

    if (!result.acknowledged) {
      throw new Error("Database operation not acknowledged");
    }

    revalidatePath("/profile");
    return { success: true, address: newAddress };
  } catch (error) {
    // console.error("Error saving shipping address:", error);
    return { success: false, error: "Failed to save shipping address" };
  }
}

export async function updateShippingAddress(addressId: string, addressData: Omit<ShippingAddress, 'id'>) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "User not authenticated" };
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("userpreferences");

    // First, find the document and check if the address exists
    const userPreference = await collection.findOne(
      { 
        email: session.user.email,
        "shippingAddresses.id": addressId 
      }
    );

    if (!userPreference) {
      return { success: false, error: "Address not found" };
    }

    const result = await collection.updateOne(
      { 
        email: session.user.email,
        "shippingAddresses.id": addressId 
      },
      { 
        $set: { 
          "shippingAddresses.$": {
            ...addressData,
            id: addressId
          },
          updatedAt: new Date()
        }
      }
    );

    if (!result.matchedCount) {
      return { success: false, error: "Address not found" };
    }

    if (!result.modifiedCount) {
      return { success: false, error: "No changes made to the address" };
    }

    revalidatePath("/profile");
    return { 
      success: true,
      message: "Address updated successfully"
    };
  } catch (error) {
    // console.error("Error updating shipping address:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update shipping address" 
    };
  }
}

/**
 * Get all user preferences from the database
 */
export async function getUserPreferences() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { 
        success: false, 
        error: "User not authenticated",
        wishlist: [],
        cart: [],
        orders: [],
        shippingAddresses: []
      };
    }
    
    const { db } = await connectToDatabase();
    const collection = db.collection("userpreferences");
    
    const userPreference = await collection.findOne<UserPreferences>(
      { email: session.user.email },
      { projection: { _id: 0 } }
    );
    
    if (!userPreference) {
      return {
        success: true,
        wishlist: [],
        cart: [],
        orders: [],
        shippingAddresses: []
      };
    }
    
    return { 
      success: true, 
      wishlist: userPreference.wishlist || [],
      cart: userPreference.cart || [],
      orders: userPreference.orders || [],
      shippingAddresses: userPreference.shippingAddresses || []
    };
  } catch (error) {
    // console.error("Error getting user preferences:", error);
    return { 
      success: false, 
      error: "Failed to get user preferences",
      wishlist: [],
      cart: [],
      orders: [],
      shippingAddresses: []
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
      // console.warn(`Invalid wishlist data`);
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
    // console.error("Error saving wishlist:", error);
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
      // console.warn(`Invalid cart data`);
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
    // console.error("Error saving cart:", error);
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
    // console.error("Error saving order:", error);
    return { success: false, error: "Failed to save order" };
  }
}

/**
 * Get available store items
 */
export async function getStoreItems(currency: string = 'USD') {
  const rates = currencyConfig[currency]?.rates || currencyConfig.USD.rates;
  
  const storeData = {
    cards: [
      {
        id: "pvc-card",
        name: "Standard PVC Business Card",
        price: rates.pvc,
        type: "pvc_card",
        description: "Durable plastic business cards that stand out from paper cards.",
        color: ["white", "black", "transparent"],
        image: "/images/pvc-card.jpg"
      },
      {
        id: "nfc-card",
        name: "NFC Business Card",
        price: rates.nfc,
        type: "nfc_card",
        description: "Digital business card with NFC technology for instant contact sharing.",
        color: ["white", "black"],
        image: "/images/nfc-card.jpg"
      },
      {
        id: "color-card",
        name: "Color Business Card",
        price: rates.color,
        type: "color_card",
        description: "Vibrant, full-color business cards that make a lasting impression.",
        color: ["white", "black", "blue", "green"],
        image: "/images/color-nfc-card.jpg"
      },
      {
        id: "premium-card",
        name: "Premium Business Card",
        price: rates.premium,
        type: "premium_card",
        description: "Luxury business cards with premium materials and finishes.",
        color: ["white", "black", "silver"],
        image: "/images/metallic-card.jpg"
      }
    ],
    editPlans: [
      {
        id: "single-edit",
        name: "Single Edit Plan",
        price: rates.singleEdit,
        type: "edit_plan",
        description: "One-time card design customization.",
        image: "/images/basic-edit.jpg"
      },
      {
        id: "five-edits",
        name: "Five Edits Plan",
        price: rates.fiveEdits,
        type: "edit_plan",
        description: "Package of five card design customizations.",
        image: "/images/standard-edit.jpg"
      },
      {
        id: "annual-plan",
        name: "Annual Edit Plan",
        price: rates.annual,
        type: "edit_plan",
        description: "Unlimited card design customizations for one year.",
        image: "/images/premium-edit.jpg"
      }
    ]
  };

  return storeData;
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
      // console.warn(`Invalid item data`);
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
    // console.error("Error adding to wishlist:", error);
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
      // console.warn(`Invalid item data`);
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
    // console.error("Error adding to cart:", error);
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
    // console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function updateUserPreferences(
  userId: string,
  countryCode: string,
  currency: string
) {
  try {
    const { db } = await connectToDatabase();

    // Check for existing wishlist, cart, and orders
    const userPreferences = await db.collection("userPreferences").findOne({ userId });
    
    if (userPreferences) {
      // Check for active orders
      const hasActiveOrder = await db.collection("orders").findOne({
        userId,
        status: { $in: ["pending", "processing"] }
      });

      if (hasActiveOrder) {
        return {
          success: false,
          message: "Cannot change country while you have orders being processed"
        };
      }

      // Check for items in wishlist
      if (userPreferences.wishlist?.length > 0) {
        return {
          success: false,
          message: "Please clear your wishlist before changing country"
        };
      }

      // Check for items in cart
      if (userPreferences.cart?.length > 0) {
        return {
          success: false,
          message: "Please clear your cart before changing country"
        };
      }
    }

    // If all checks pass, update the preferences
    const result = await db.collection("userPreferences").updateOne(
      { userId },
      {
        $set: {
          countryCode,
          currency,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return {
      success: true,
      message: "Preferences updated successfully"
    };
  } catch (error) {
    // console.error("Failed to update user preferences:", error);
    return {
      success: false,
      message: "Failed to update preferences"
    };
  }
}

// Add this new function after other export functions
export async function saveEmailPreferences(preferences: { 
  marketingEmails?: boolean; 
  promotionalEmails?: boolean; 
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "User not authenticated" };
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection("userpreferences").updateOne(
      { email: session.user.email },
      { 
        $set: {
          ...preferences,
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

    revalidatePath("/profile");
    
    return { success: true };
  } catch (error) {
    // console.error("Failed to save email preferences:", error);
    return { success: false, error: "Failed to save preferences" };
  }
}

// Add this new function
export async function deleteShippingAddress(addressId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "User not authenticated" };
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("userpreferences");

    const result = await collection.updateOne(
      { email: session.user.email },
      { 
        $pull: { 
          shippingAddresses: { id: addressId } 
        } as any,
        $set: { updatedAt: new Date() }
      }
    );

    if (!result.acknowledged) {
      throw new Error("Database operation not acknowledged");
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    // console.error("Error deleting shipping address:", error);
    return { success: false, error: "Failed to delete shipping address" };
  }
}
