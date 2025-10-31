'use server'
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb'

export type ProfileData = {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  middleName: string;
  photo: string;
  birthday: string;
  title: string;
  company: string;
  companyLogo: string;
  workEmail: string;
  personalEmail: string;
  mobile: string;
  workPhone: string;
  fax: string;
  homePhone: string;
  workStreet: string;
  workDistrict: string;
  workCity: string;
  workState: string;
  workZipcode: string;
  workCountry: string;
  homeStreet: string;
  homeDistrict: string;
  homeCity: string;
  homeState: string;
  homeZipcode: string;
  homeCountry: string;
  website: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
  notes: string;
  name: string;
  workAddress: string;
  isPremium: boolean;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
  shorturl?: string;
}

export async function saveProfile(data: Partial<ProfileData>, userEmail: string) {
  try {
    // console.log('saveProfile called with:', { userEmail, dataFields: Object.keys(data) });

    if (!userEmail || typeof userEmail !== 'string' || userEmail.trim() === '') {
      // console.error('Invalid userEmail in saveProfile:', { userEmail });
      return { 
        success: false, 
        error: 'User email is required' 
      };
    }

    const client = await clientPromise;
    const db = client.db('smartwave');
    const now = new Date();

    // Ensure userEmail is included in profileData
    const profileData = {
      ...data,
      userEmail: userEmail.toLowerCase().trim(), // Normalize email
      updatedAt: now,
    };

    // console.log('Checking existing profile for user:', userEmail);
    const existingProfile = await db.collection('profiles').findOne({ userEmail });

    if (existingProfile) {
      // console.log('Updating existing profile for user:', userEmail);
      await db.collection('profiles').updateOne(
        { userEmail },
        { 
          $set: profileData,
          $setOnInsert: { createdAt: now }
        }
      );
    } else {
      // console.log('Creating new profile for user:', userEmail);
      await db.collection('profiles').insertOne({
        ...profileData,
        createdAt: now,
        isPremium: false
      });
    }
    // Avoid triggering app-wide refreshes during client-side autosave.
    // If needed, revalidation can be reintroduced via tags or scoped routes.
    return { success: true };
  } catch (error) {
    // console.error('Profile save error:', {
    //   error,
    //   userEmail,
    //   stack: error instanceof Error ? error.stack : undefined
    // });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save profile' 
    };
  }
}

export async function getProfile(userEmail: string): Promise<ProfileData | null> {
  try {
    if (!userEmail) {
      // console.error('No userEmail provided to getProfile');
      return null;
    }

    const client = await clientPromise;
    const db = client.db('smartwave');
    
    // console.log(`Fetching profile for user: ${userEmail}`);
    const profile = await db.collection('profiles').findOne({ userEmail });
    
    if (!profile) {
      // console.log(`No profile found for user: ${userEmail}`);
      return null;
    }

    // Return a plain JSON-serializable object (no ObjectId/Date instances)
    const plain = JSON.parse(JSON.stringify(profile));
    return plain as ProfileData;
  } catch (error) {
    // console.error('Failed to get profile:', error);
    return null;
  }
}

export async function deleteProfile(userEmail: string) {
  try {
    const client = await clientPromise;
    const db = client.db('smartwave');
    
    await db.collection('profiles').deleteOne({ userEmail });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    // console.error('Failed to delete profile:', error);
    return { success: false, error: 'Failed to delete profile' };
  }
}

export async function getProfileByShortUrl(shorturl: string): Promise<ProfileData | null> {
  try {
    const client = await clientPromise;
    const db = client.db('smartwave');
    
    // console.log(`Fetching profile by shortURL: ${shorturl}`);
    const profile = await db.collection('profiles').findOne({ shorturl });
    
    if (!profile) {
      // console.log(`No profile found for shortURL: ${shorturl}`);
      return null;
    }

    const plain = JSON.parse(JSON.stringify(profile));
    return plain as ProfileData;
  } catch (error) {
    // console.error('Failed to get profile by shortURL:', error);
    return null;
  }
}

export async function generateAndUpdateShortUrl(userEmail: string) {
  try {
    const client = await clientPromise;
    const db = client.db('smartwave');
    
    // Get the user's profile
    const profile = await db.collection('profiles').findOne({ userEmail });
    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    // Generate short URL from MongoDB _id
    const id = profile._id.toString();
    const shorturl = id.substring(0, 5) + id.substring(id.length - 5);

    // Update the profile with the short URL
    await db.collection('profiles').updateOne(
      { userEmail },
      { $set: { shorturl } }
    );

    revalidatePath('/dashboard');
    return { success: true, shorturl };
  } catch (error) {
    // console.error('Failed to generate short URL:', error);
    return { success: false, error: 'Failed to generate short URL' };
  }
} 