import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminUsersCollection, getAdminEmployeeProfilesCollection } from "@/lib/admin/db";
import { buildName } from "@/lib/admin/employee-profile";

export const dynamic = "force-dynamic";

function getAdminId(req: NextRequest): string | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? verifyAdminSession(token) : null;
  if (!payload || payload.type !== "admin") return null;
  return payload.adminId;
}

/** GET /api/admin/employee-profiles - List employee profiles for the logged-in admin (enforces limit in response) */
export async function GET(req: NextRequest) {
  const adminId = getAdminId(req);
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const coll = await getAdminEmployeeProfilesCollection();
    const list = await coll
      .find({ createdByAdminId: new ObjectId(adminId) })
      .sort({ updatedAt: -1 })
      .toArray();
    const usersColl = await getAdminUsersCollection();
    const admin = await usersColl.findOne({ _id: new ObjectId(adminId) });
    const limit = admin?.limits?.profiles ?? 0;

    const plain = list.map((p) => ({
      ...p,
      _id: p._id.toString(),
      createdByAdminId: p.createdByAdminId.toString(),
      createdAt: (p as any).createdAt?.toISOString?.(),
      updatedAt: (p as any).updatedAt?.toISOString?.(),
    }));

    return NextResponse.json({ profiles: plain, limit, used: plain.length });
  } catch (e) {
    console.error("[admin employee-profiles GET]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** POST /api/admin/employee-profiles - Create employee profile (enforces limit). Body: partial profile fields. */
export async function POST(req: NextRequest) {
  const adminId = getAdminId(req);
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const usersColl = await getAdminUsersCollection();
    const admin = await usersColl.findOne({ _id: new ObjectId(adminId) });
    const limit = admin?.limits?.profiles ?? 0;

    const profilesColl = await getAdminEmployeeProfilesCollection();
    const used = await profilesColl.countDocuments({ createdByAdminId: new ObjectId(adminId) });
    if (used >= limit) {
      return NextResponse.json(
        { error: `Profile limit reached (${limit}). Ask super admin to increase your limit.` },
        { status: 400 }
      );
    }

    const body = await req.json();
    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
    const middleName = typeof body.middleName === "string" ? body.middleName.trim() : "";
    const name = buildName(firstName, middleName, lastName);

    const now = new Date();
    const doc = {
      createdByAdminId: new ObjectId(adminId),
      firstName,
      lastName,
      middleName: middleName || undefined,
      name,
      title: typeof body.title === "string" ? body.title.trim() : undefined,
      company: typeof body.company === "string" ? body.company.trim() : undefined,
      workEmail: typeof body.workEmail === "string" ? body.workEmail.trim() : undefined,
      mobile: typeof body.mobile === "string" ? body.mobile.trim() : undefined,
      workPhone: typeof body.workPhone === "string" ? body.workPhone.trim() : undefined,
      workStreet: typeof body.workStreet === "string" ? body.workStreet.trim() : undefined,
      workCity: typeof body.workCity === "string" ? body.workCity.trim() : undefined,
      workState: typeof body.workState === "string" ? body.workState.trim() : undefined,
      workZipcode: typeof body.workZipcode === "string" ? body.workZipcode.trim() : undefined,
      workCountry: typeof body.workCountry === "string" ? body.workCountry.trim() : undefined,
      website: typeof body.website === "string" ? body.website.trim() : undefined,
      notes: typeof body.notes === "string" ? body.notes.trim() : undefined,
      createdAt: now,
      updatedAt: now,
    };

    const insert = await profilesColl.insertOne(doc as any);
    const created = await profilesColl.findOne({ _id: insert.insertedId });
    const plain = {
      ...created,
      _id: created!._id.toString(),
      createdByAdminId: (created as any).createdByAdminId.toString(),
      createdAt: (created as any).createdAt?.toISOString?.(),
      updatedAt: (created as any).updatedAt?.toISOString?.(),
    };
    return NextResponse.json({ profile: plain });
  } catch (e) {
    console.error("[admin employee-profiles POST]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
