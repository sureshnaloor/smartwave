'use server'
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { getAdminUsersCollection } from '@/lib/admin/db';

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
  /** When set, profile is owned by company admin; only admin can edit/delete */
  createdByAdminId?: ObjectId;
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
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const now = new Date();
    const normalizedEmail = userEmail.toLowerCase().trim();

    // Ensure userEmail is included in profileData
    const profileData = {
      ...data,
      userEmail: normalizedEmail,
      updatedAt: now,
    };

    const existingProfile = await db.collection('profiles').findOne({ userEmail: normalizedEmail });
    if (existingProfile?.createdByAdminId) {
      return { success: false, error: "Only your company admin can edit this profile." };
    }

    if (existingProfile) {
      await db.collection('profiles').updateOne(
        { userEmail: normalizedEmail },
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

    // Trigger Wallet updates (only for users who may have added the pass; 404 is normal if not yet added)
    try {
      const updatedProfile = await getProfile(normalizedEmail);
      if (updatedProfile) {
        // Google Wallet update (404 is normal if user hasn't added the pass yet)
        const { updateGoogleWalletObject } = await import('@/lib/wallet/google');
        await updateGoogleWalletObject(updatedProfile).catch(() => {});

        // Apple Wallet push (no-op if no devices registered)
        const { sendApplePushNotification } = await import('@/lib/wallet/push');
        sendApplePushNotification(normalizedEmail).catch(() => {});
      }
    } catch (walletErr) {
      console.error('[Profile Action] Error initiating Wallet updates:', walletErr);
    }

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
    if (!userEmail) return null;
    const normalizedEmail = userEmail.trim().toLowerCase();

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const profile = await db.collection('profiles').findOne({ userEmail: normalizedEmail });

    if (!profile) {
      // console.log(`No profile found for user: ${userEmail}`);
      return null;
    }

    // Enrich corporate employee profiles with admin's company info (name, logo, address)
    const adminId = profile.createdByAdminId;
    if (adminId) {
      const adminColl = await getAdminUsersCollection();
      const admin = await adminColl.findOne({ _id: new ObjectId(adminId.toString()) });
      const company = admin?.company;
      if (company) {
        if (company.name) profile.company = company.name;
        if (company.logo) profile.companyLogo = company.logo;
        if (company.address && !profile.workStreet) profile.workStreet = company.address;
      }
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
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const normalizedEmail = userEmail.trim().toLowerCase();
    await db.collection('profiles').deleteOne({ userEmail: normalizedEmail });
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
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const profile = await db.collection('profiles').findOne({ shorturl });

    if (!profile) {
      // console.log(`No profile found for shortURL: ${shorturl}`);
      return null;
    }

    // Enrich corporate employee profiles with admin's company info
    const adminId = profile.createdByAdminId;
    if (adminId) {
      const adminColl = await getAdminUsersCollection();
      const admin = await adminColl.findOne({ _id: new ObjectId(adminId.toString()) });
      const company = admin?.company;
      if (company) {
        if (company.name) profile.company = company.name;
        if (company.logo) profile.companyLogo = company.logo;
        if (company.address && !profile.workStreet) profile.workStreet = company.address;
      }
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
    if (!userEmail?.trim()) return { success: false, error: 'Profile not found' };
    const normalizedEmail = userEmail.trim().toLowerCase();

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    let profile = await db.collection('profiles').findOne({ userEmail: normalizedEmail });

    // If no profile yet (user hasn't saved), create a minimal one so we can generate shorturl
    if (!profile) {
      const now = new Date();
      await db.collection('profiles').insertOne({
        userEmail: normalizedEmail,
        name: normalizedEmail,
        firstName: '',
        lastName: '',
        middleName: '',
        photo: '',
        birthday: '',
        title: '',
        company: '',
        companyLogo: '',
        workEmail: '',
        personalEmail: '',
        mobile: '',
        workPhone: '',
        fax: '',
        homePhone: '',
        workStreet: '',
        workDistrict: '',
        workCity: '',
        workState: '',
        workZipcode: '',
        workCountry: '',
        homeStreet: '',
        homeDistrict: '',
        homeCity: '',
        homeState: '',
        homeZipcode: '',
        homeCountry: '',
        website: '',
        linkedin: '',
        twitter: '',
        facebook: '',
        instagram: '',
        youtube: '',
        notes: '',
        workAddress: '',
        isPremium: false,
        createdAt: now,
        updatedAt: now,
      });
      profile = await db.collection('profiles').findOne({ userEmail: normalizedEmail });
    }
    if (!profile) return { success: false, error: 'Profile not found' };

    const id = profile._id.toString();
    const shorturl = id.substring(0, 5) + id.substring(id.length - 5);

    await db.collection('profiles').updateOne(
      { userEmail: normalizedEmail },
      { $set: { shorturl, updatedAt: new Date() } }
    );

    revalidatePath('/dashboard');
    return { success: true, shorturl };
  } catch (error) {
    // console.error('Failed to generate short URL:', error);
    return { success: false, error: 'Failed to generate short URL' };
  }
} 