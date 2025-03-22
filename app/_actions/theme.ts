"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const themeSchema = z.object({
  theme: z.enum(["light", "dark", "system"])
});

type ThemePreference = {
  email: string;
  theme: string;
};

/**
 * Save user theme preference to the database
 */
export async function saveThemePreference(formData: FormData) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      // Don't log a warning, this happens during normal operation
      // when the client tries to save a theme when the session is expiring/changing
      return { success: false, error: "User not authenticated" };
    }

    // Extract theme from form data
    const theme = formData.get("theme") as string;
    
    // Validate theme
    const validationResult = themeSchema.safeParse({ theme });
    if (!validationResult.success) {
      console.warn(`Invalid theme value: ${theme}`);
      return { 
        success: false, 
        error: "Invalid theme value. Must be 'light', 'dark', or 'system'." 
      };
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Get userpreferences collection
    const collection = db.collection("userpreferences");
    
    // Create document to insert/update
    const themeDoc = {
      email: session.user.email,
      theme: theme,
      updatedAt: new Date()
    };
    
    const setOnInsert = {
      createdAt: new Date()
    };
    
    // Upsert user theme preference
    const result = await collection.updateOne(
      { email: session.user.email },
      { 
        $set: themeDoc,
        $setOnInsert: setOnInsert
      },
      { upsert: true }
    );
    
    if (!result.acknowledged) {
      throw new Error("Database operation not acknowledged");
    }
    
    // Only log on successful saves
    console.log(`Theme preference saved for ${session.user.email}: ${theme}`);
    
    // Revalidate paths that might depend on theme
    revalidatePath("/profile");
    
    return { success: true, theme };
  } catch (error) {
    console.error("Error saving theme preference:", error);
    return { success: false, error: "Failed to save theme preference" };
  }
}

/**
 * Get user theme preference from the database
 */
export async function getThemePreference() {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      // This is an expected case, so don't log a warning
      // It happens during normal auth state transitions
      return { success: false, error: "User not authenticated", theme: "light" };
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Get userpreferences collection
    const collection = db.collection("userpreferences");
    
    // Find user theme preference
    const userPreference = await collection.findOne<ThemePreference>(
      { email: session.user.email },
      { projection: { _id: 0, theme: 1 } }
    );
    
    // Only log when a preference is found (reduces noise)
    if (userPreference?.theme) {
      console.log(`Theme preference retrieved for ${session.user.email}: ${userPreference.theme}`);
    }
    
    // Return theme or default to "light"
    return { 
      success: true, 
      theme: userPreference?.theme || "light" 
    };
  } catch (error) {
    console.error("Error getting theme preference:", error);
    return { success: false, error: "Failed to get theme preference", theme: "light" };
  }
} 