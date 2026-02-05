import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminUsersCollection } from "@/lib/admin/db";

export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/** GET /api/admin/me - Returns current admin session (super or admin user) from cookie or NextAuth session */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      // Check for regular user session
      const nextSession = await getServerSession(authOptions);
      if (nextSession?.user?.email) {
        const email = nextSession.user.email.toLowerCase();
        const adminUsersColl = await getAdminUsersCollection();
        let adminRecord = await adminUsersColl.findOne({ email });

        if (!adminRecord) {
          const client = await clientPromise;
          const db = client.db(process.env.MONGODB_DB || "smartwave");
          const mainUser = await db.collection("users").findOne({ email });

          if (mainUser && mainUser.role === "public_admin") {
            const now = new Date();
            const insertRes = await adminUsersColl.insertOne({
              email,
              username: mainUser.name || email.split('@')[0],
              role: "public",
              firstLoginDone: true,
              limits: { profiles: 0, passes: 5 },
              createdAt: now,
              updatedAt: now,
              password: ""
            } as any);
            adminRecord = await adminUsersColl.findOne({ _id: insertRes.insertedId });
          }
        }

        if (adminRecord && (adminRecord.role === "public" || adminRecord.role === "corporate")) {
          return NextResponse.json({
            session: {
              type: "admin",
              adminId: adminRecord._id.toString(),
              email: adminRecord.email,
              username: adminRecord.username,
              limits: adminRecord.limits,
              role: adminRecord.role,
              firstLoginDone: true,
            },
          });
        }
      }
      return NextResponse.json({ session: null }, { status: 200 });
    }

    const payload = verifyAdminSession(token);
    if (!payload) {
      return NextResponse.json({ session: null }, { status: 200 });
    }

    if (payload.type === "super") {
      return NextResponse.json({
        session: { type: "super" },
      });
    }

    // Admin user: refresh limits from DB in case they were updated
    const coll = await getAdminUsersCollection();
    let user;
    try {
      user = await coll.findOne({ _id: new ObjectId(payload.adminId) });
    } catch {
      user = null;
    }
    if (!user) {
      return NextResponse.json({ session: null }, { status: 200 });
    }

    return NextResponse.json({
      session: {
        type: "admin",
        adminId: user._id.toString(),
        email: user.email,
        username: user.username,
        limits: user.limits,
        role: user.role || "corporate",
        firstLoginDone: user.firstLoginDone,
      },
    });
  } catch (e) {
    console.error("[admin me]", e);
    return NextResponse.json({ session: null }, { status: 200 });
  }
}
