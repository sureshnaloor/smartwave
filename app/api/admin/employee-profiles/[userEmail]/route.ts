import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/admin/auth";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

function getAdminId(req: NextRequest): string | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? verifyAdminSession(token) : null;
  if (!payload || payload.type !== "admin") return null;
  return payload.adminId;
}

/** GET /api/admin/employee-profiles/[userEmail] - Get single employee profile (admin must own it) */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userEmail: string }> }
) {
  const adminId = getAdminId(req);
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userEmail = decodeURIComponent((await params).userEmail).trim().toLowerCase();
  if (!userEmail) return NextResponse.json({ error: "Invalid user email" }, { status: 400 });

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const profilesColl = db.collection("profiles");
    const profile = await profilesColl.findOne({
      userEmail,
      createdByAdminId: new ObjectId(adminId),
    });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found or access denied" }, { status: 404 });
    }
    const plain = {
      ...profile,
      _id: (profile as any)._id.toString(),
      createdByAdminId: (profile as any).createdByAdminId?.toString(),
      createdAt: (profile as any).createdAt?.toISOString?.(),
      updatedAt: (profile as any).updatedAt?.toISOString?.(),
    };
    return NextResponse.json({ profile: plain });
  } catch (e) {
    console.error("[admin employee-profiles GET single]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** PATCH /api/admin/employee-profiles/[userEmail] - Update employee profile (admin only, owner only) */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userEmail: string }> }
) {
  const adminId = getAdminId(req);
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userEmail = decodeURIComponent((await params).userEmail).trim().toLowerCase();
  if (!userEmail) return NextResponse.json({ error: "Invalid user email" }, { status: 400 });

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const profilesColl = db.collection("profiles");
    const existing = await profilesColl.findOne({
      userEmail,
      createdByAdminId: new ObjectId(adminId),
    });
    if (!existing) {
      return NextResponse.json({ error: "Profile not found or access denied" }, { status: 404 });
    }

    const body = await req.json();
    const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
    const firstName = str(body.firstName);
    const lastName = str(body.lastName);
    const middleName = str(body.middleName);
    const name = [firstName, middleName, lastName].filter(Boolean).join(" ").trim() || userEmail;

    const update: Record<string, unknown> = {
      firstName,
      lastName,
      middleName: middleName || undefined,
      name,
      title: str(body.title) || undefined,
      company: str(body.company) || undefined,
      mobile: str(body.mobile) || undefined,
      workPhone: str(body.workPhone) || undefined,
      photo: typeof body.photo === "string" ? body.photo.trim() : (existing as any).photo ?? "",
      website: str(body.website) || undefined,
      linkedin: str(body.linkedin) || undefined,
      twitter: str(body.twitter) || undefined,
      facebook: str(body.facebook) || undefined,
      instagram: str(body.instagram) || undefined,
      youtube: str(body.youtube) || undefined,
      notes: str(body.notes) || undefined,
      workStreet: str(body.workStreet) || undefined,
      workCity: str(body.workCity) || undefined,
      workState: str(body.workState) || undefined,
      workZipcode: str(body.workZipcode) || undefined,
      workCountry: str(body.workCountry) || undefined,
      updatedAt: new Date(),
    };
    const setUpdate: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(update)) {
      if (v !== undefined) setUpdate[k] = v;
    }

    await profilesColl.updateOne(
      { userEmail, createdByAdminId: new ObjectId(adminId) },
      { $set: setUpdate }
    );

    const updated = await profilesColl.findOne({ userEmail });
    const plain = {
      ...updated,
      _id: (updated as any)._id.toString(),
      createdByAdminId: (updated as any).createdByAdminId?.toString(),
      createdAt: (updated as any).createdAt?.toISOString?.(),
      updatedAt: (updated as any).updatedAt?.toISOString?.(),
    };
    return NextResponse.json({ profile: plain });
  } catch (e) {
    console.error("[admin employee-profiles PATCH]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** DELETE /api/admin/employee-profiles/[userEmail] - Delete employee profile and user (admin owner only) */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userEmail: string }> }
) {
  const adminId = getAdminId(req);
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userEmail = decodeURIComponent((await params).userEmail).trim().toLowerCase();
  if (!userEmail) return NextResponse.json({ error: "Invalid user email" }, { status: 400 });

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const profilesColl = db.collection("profiles");
    const usersColl = db.collection("users");

    const profile = await profilesColl.findOne({
      userEmail,
      createdByAdminId: new ObjectId(adminId),
    });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found or access denied" }, { status: 404 });
    }

    await profilesColl.deleteOne({ userEmail, createdByAdminId: new ObjectId(adminId) });
    await usersColl.deleteOne({ email: userEmail, role: "employee", createdByAdminId: new ObjectId(adminId) });

    return NextResponse.json({ success: true, message: "Employee profile and account removed." });
  } catch (e) {
    console.error("[admin employee-profiles DELETE]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
