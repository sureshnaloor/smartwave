import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { hash } from "bcrypt";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminUsersCollection } from "@/lib/admin/db";
import clientPromise from "@/lib/mongodb";
import { generateAndUpdateShortUrl } from "@/app/_actions/profile";

export const dynamic = "force-dynamic";

function getAdminId(req: NextRequest): string | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? verifyAdminSession(token) : null;
  if (!payload || payload.type !== "admin") return null;
  return payload.adminId;
}

/** GET /api/admin/employee-profiles - List employee profiles (from main profiles with createdByAdminId) */
export async function GET(req: NextRequest) {
  const adminId = getAdminId(req);
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!ObjectId.isValid(adminId)) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  try {
    const adminObjId = new ObjectId(adminId);
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const profilesColl = db.collection("profiles");
    const list = await profilesColl
      .find({ createdByAdminId: adminObjId })
      .sort({ updatedAt: -1 })
      .toArray();

    const usersColl = await getAdminUsersCollection();
    const admin = await usersColl.findOne({ _id: adminObjId });
    const limit = admin?.limits?.profiles ?? 0;

    const plain = list.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      createdByAdminId: p.createdByAdminId?.toString(),
      createdAt: p.createdAt?.toISOString?.(),
      updatedAt: p.updatedAt?.toISOString?.(),
    }));

    return NextResponse.json({ profiles: plain, limit, used: plain.length });
  } catch (e) {
    console.error("[admin employee-profiles GET]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** POST /api/admin/employee-profiles - Create employee: user (temp password) + profile. workEmail and temporaryPassword required. */
export async function POST(req: NextRequest) {
  const adminId = getAdminId(req);
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const usersColl = await getAdminUsersCollection();
    const admin = await usersColl.findOne({ _id: new ObjectId(adminId) });
    const limit = admin?.limits?.profiles ?? 0;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const profilesColl = db.collection("profiles");
    const used = await profilesColl.countDocuments({ createdByAdminId: new ObjectId(adminId) });
    if (used >= limit) {
      return NextResponse.json(
        { error: `Profile limit reached (${limit}). Ask super admin to increase your limit.` },
        { status: 400 }
      );
    }

    const body = await req.json();
    const workEmail = typeof body.workEmail === "string" ? body.workEmail.trim().toLowerCase() : "";
    const temporaryPassword = typeof body.temporaryPassword === "string" ? body.temporaryPassword : "";
    if (!workEmail || !temporaryPassword) {
      return NextResponse.json(
        { error: "Work email and temporary password are required" },
        { status: 400 }
      );
    }
    if (temporaryPassword.length < 6) {
      return NextResponse.json(
        { error: "Temporary password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
    const middleName = typeof body.middleName === "string" ? body.middleName.trim() : "";
    const name = [firstName, middleName, lastName].filter(Boolean).join(" ").trim() || workEmail;

    const usersCollection = db.collection("users");
    const existingUser = await usersCollection.findOne({ email: workEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this work email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(temporaryPassword, 10);
    const now = new Date();
    const adminObjId = new ObjectId(adminId);

    await usersCollection.insertOne({
      email: workEmail,
      name,
      password: hashedPassword,
      role: "employee",
      createdByAdminId: adminObjId,
      firstLoginDone: false,
      createdAt: now,
      updatedAt: now,
    });

    const companyLogo = (admin as any)?.companyLogo ?? "";
    const profileDoc: Record<string, unknown> = {
      createdByAdminId: adminObjId,
      userEmail: workEmail,
      firstName,
      lastName,
      middleName: middleName || undefined,
      name,
      title: typeof body.title === "string" ? body.title.trim() : undefined,
      company: typeof body.company === "string" ? body.company.trim() : undefined,
      workEmail,
      companyLogo,
      photo: typeof body.photo === "string" ? body.photo.trim() : "",
      personalEmail: "",
      mobile: typeof body.mobile === "string" ? body.mobile.trim() : undefined,
      workPhone: typeof body.workPhone === "string" ? body.workPhone.trim() : undefined,
      fax: "",
      homePhone: "",
      workStreet: typeof body.workStreet === "string" ? body.workStreet.trim() : undefined,
      workDistrict: "",
      workCity: typeof body.workCity === "string" ? body.workCity.trim() : undefined,
      workState: typeof body.workState === "string" ? body.workState.trim() : undefined,
      workZipcode: typeof body.workZipcode === "string" ? body.workZipcode.trim() : undefined,
      workCountry: typeof body.workCountry === "string" ? body.workCountry.trim() : undefined,
      homeStreet: "",
      homeDistrict: "",
      homeCity: "",
      homeState: "",
      homeZipcode: "",
      homeCountry: "",
      website: typeof body.website === "string" ? body.website.trim() : undefined,
      linkedin: typeof body.linkedin === "string" ? body.linkedin.trim() : undefined,
      twitter: typeof body.twitter === "string" ? body.twitter.trim() : undefined,
      facebook: typeof body.facebook === "string" ? body.facebook.trim() : undefined,
      instagram: typeof body.instagram === "string" ? body.instagram.trim() : undefined,
      youtube: typeof body.youtube === "string" ? body.youtube.trim() : undefined,
      notes: typeof body.notes === "string" ? body.notes.trim() : undefined,
      workAddress: "",
      isPremium: false,
      createdAt: now,
      updatedAt: now,
    };

    await profilesColl.insertOne(profileDoc);
    const result = await generateAndUpdateShortUrl(workEmail);
    if (result.success && result.shorturl) {
      await profilesColl.updateOne(
        { userEmail: workEmail },
        { $set: { shorturl: result.shorturl, updatedAt: new Date() } }
      );
    }

    const created = await profilesColl.findOne({ userEmail: workEmail });
    const plain = {
      ...created,
      _id: (created as any)._id.toString(),
      createdByAdminId: (created as any).createdByAdminId?.toString(),
      createdAt: (created as any).createdAt?.toISOString?.(),
      updatedAt: (created as any).updatedAt?.toISOString?.(),
    };

    return NextResponse.json({
      profile: plain,
      temporaryPassword,
      message: "Show the temporary password to the employee once; they must change it on first login.",
    });
  } catch (e) {
    console.error("[admin employee-profiles POST]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
