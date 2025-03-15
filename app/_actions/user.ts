"use server"

import clientPromise from "@/lib/mongodb"
import { revalidatePath } from "next/cache"

interface VCardUpdateData {
  firstName?: string
  middleName?: string
  lastName?: string
  title?: string
  company?: string
  workEmail?: string
  workPhone?: string
  mobile?: string
  workStreet?: string
  workCity?: string
  workState?: string
  workZipcode?: string
  workCountry?: string
  website?: string
}

export async function updateVCardInfo(formData: FormData) {
  try {
    const client = await clientPromise
    const db = client.db('smartwave')  // Explicitly use smartwave database
    
    // Log database info
    console.log('Connected to database:', db.databaseName)
    const collections = await db.listCollections().toArray()
    console.log('Available collections:', collections.map(c => c.name))
    
    const userEmail = formData.get('userEmail') as string
    if (!userEmail) {
      throw new Error("User email is required")
    }

    // Convert FormData to object
    const data: VCardUpdateData = {
      firstName: formData.get('firstName') as string,
      middleName: formData.get('middleName') as string,
      lastName: formData.get('lastName') as string,
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      workEmail: formData.get('workEmail') as string,
      workPhone: formData.get('workPhone') as string,
      mobile: formData.get('mobile') as string,
      workStreet: formData.get('workStreet') as string,
      workCity: formData.get('workCity') as string,
      workState: formData.get('workState') as string,
      workZipcode: formData.get('workZipcode') as string,
      workCountry: formData.get('workCountry') as string,
      website: formData.get('website') as string,
    }

    console.log('Starting vCard update')
    console.log('Received userEmail:', userEmail)
    console.log('Update data received:', data)

    // Update only the provided fields
    const updateData: { [key: string]: string } = {}
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        updateData[key] = value
      }
    })

    // First, try to find the user with detailed logging
    const collection = db.collection("profiles")
    
    // Log the total count and sample to verify collection access
    const totalProfiles = await collection.countDocuments()
    console.log('Total profiles in collection:', totalProfiles)
    
    // Try to find the profile with exact query
    const query = { userEmail: userEmail }
    console.log('Searching with query:', query)
    
    const profile = await collection.findOne(query)
    console.log('Found profile:', profile ? 'Yes' : 'No')

    if (!profile) {
      // If not found, let's see what emails are in the database
      const allProfiles = await collection.find({}).toArray()
      console.log('All profiles in collection:', allProfiles)
      throw new Error("Profile not found. Please check database connection and collection name.")
    }

    // Update the profile document
    const updateResult = await collection.updateOne(
      query,
      { $set: updateData }
    )

    if (!updateResult.matchedCount) {
      console.error('Update failed - no profile matched the query')
      throw new Error("Failed to update contact information.")
    }

    // Revalidate the page to show updated data
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error("Error in updateVCardInfo:", error)
    throw error
  }
} 