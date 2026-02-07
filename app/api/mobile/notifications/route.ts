import { NextRequest, NextResponse } from "next/server";
import { getBearerUser } from "@/lib/mobile-auth";
import { getNotificationsCollection } from "@/lib/admin/db";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/**
 * GET /api/mobile/notifications
 * Authorization: Bearer <token>
 * Get notifications for the current employee user.
 * By default returns only unread notifications.
 * Pass ?includeRead=true to get both read and unread with an `isRead` flag.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const user = getBearerUser(authHeader);
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userEmail = user.email.toLowerCase();
    const includeRead = req.nextUrl.searchParams.get("includeRead") === "true";

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const dbUser = await db.collection("users").findOne({ email: userEmail });

    if (!dbUser || (dbUser as any).role !== "employee" || !(dbUser as any).createdByAdminId) {
      return NextResponse.json({ notifications: [] });
    }

    const adminId = (dbUser as any).createdByAdminId;
    const notificationsColl = await getNotificationsCollection();

    // All notifications for this company (created by their admin)
    // that are either for all employees (targetUserEmail is null/undefined) or specifically for this user
    const allNotifications = await notificationsColl
      .find({
        createdByAdminId: new ObjectId(adminId.toString()),
        $or: [
          { targetUserEmail: null },
          { targetUserEmail: undefined },
          { targetUserEmail: userEmail },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    const mapped = allNotifications.map((n) => {
      const isRead = n.readBy.some((r) => r.userEmail === userEmail);
      return { n, isRead };
    });

    const visible = includeRead ? mapped : mapped.filter((m) => !m.isRead);

    const plain = visible.map(({ n, isRead }) => ({
      _id: n._id!.toString(),
      type: n.type,
      title: n.title,
      content: n.content,
      eventDate: n.eventDate?.toISOString(),
      createdAt: n.createdAt.toISOString(),
      isRead,
    }));

    return NextResponse.json({ notifications: plain });
  } catch (error) {
    console.error("[mobile notifications GET]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
