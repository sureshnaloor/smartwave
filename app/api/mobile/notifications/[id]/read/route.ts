import { NextRequest, NextResponse } from "next/server";
import { getBearerUser } from "@/lib/mobile-auth";
import { getNotificationsCollection } from "@/lib/admin/db";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/**
 * POST /api/mobile/notifications/[id]/read
 * Authorization: Bearer <token>
 * Mark a notification as read
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authHeader = req.headers.get("authorization");
  const user = getBearerUser(authHeader);
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notificationId = params.id;
    if (!ObjectId.isValid(notificationId)) {
      return NextResponse.json({ error: "Invalid notification ID" }, { status: 400 });
    }

    const userEmail = user.email.toLowerCase();
    const notificationsColl = await getNotificationsCollection();

    // Check if notification exists and belongs to user's company
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const dbUser = await db.collection("users").findOne({ email: userEmail });

    if (!dbUser || (dbUser as any).role !== "employee" || !(dbUser as any).createdByAdminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const notification = await notificationsColl.findOne({
      _id: new ObjectId(notificationId),
      createdByAdminId: new ObjectId((dbUser as any).createdByAdminId.toString()),
    });

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    // Check if already read
    const isAlreadyRead = notification.readBy.some((r) => r.userEmail === userEmail);
    if (!isAlreadyRead) {
      await notificationsColl.updateOne(
        { _id: new ObjectId(notificationId) },
        {
          $push: {
            readBy: {
              userEmail,
              readAt: new Date(),
            },
          },
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[mobile notifications/[id]/read POST]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
