import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getNotificationsCollection } from "@/lib/admin/db";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/**
 * POST /api/notifications/[id]/read
 * Mark a notification as read for the current user
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notificationId = params.id;
    if (!ObjectId.isValid(notificationId)) {
      return NextResponse.json({ error: "Invalid notification ID" }, { status: 400 });
    }

    const userEmail = session.user.email.toLowerCase();
    const notificationsColl = await getNotificationsCollection();
    const notification = await notificationsColl.findOne({ _id: new ObjectId(notificationId) });

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    // Check if already read
    const alreadyRead = notification.readBy.some((r) => r.userEmail === userEmail);
    if (alreadyRead) {
      return NextResponse.json({ success: true });
    }

    // Add to readBy array
    await notificationsColl.updateOne(
      { _id: new ObjectId(notificationId) },
      {
        $push: {
          readBy: {
            userEmail,
            readAt: new Date(),
          },
        },
        $set: {
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[notifications/[id]/read POST]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
