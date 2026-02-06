import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/admin/auth";
import { getNotificationsCollection, getAdminUsersCollection } from "@/lib/admin/db";
import { ObjectId } from "mongodb";
import type { AdminSessionPayload } from "@/lib/admin/types";
import type { Notification, NotificationType } from "@/lib/admin/notification";

export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

async function getSession(req: NextRequest): Promise<AdminSessionPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? verifyAdminSession(token) : null;
  if (payload) return payload;

  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    const usersColl = await getAdminUsersCollection();
    const admin = await usersColl.findOne({ email: session.user.email.toLowerCase() });

    if (admin && (admin.role === "public" || admin.role === "corporate")) {
      return {
        type: "admin",
        adminId: admin._id.toString(),
        email: admin.email,
        username: admin.username,
        limits: admin.limits || { profiles: 0, passes: 5 },
      };
    }
  }

  return null;
}

/**
 * GET /api/admin/notifications
 * Get all notifications created by the admin
 */
export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.type !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notificationsColl = await getNotificationsCollection();
    const notifications = await notificationsColl
      .find({ createdByAdminId: new ObjectId(session.adminId) })
      .sort({ createdAt: -1 })
      .toArray();

    const plain = notifications.map((n) => ({
      _id: n._id!.toString(),
      createdByAdminId: n.createdByAdminId.toString(),
      type: n.type,
      title: n.title,
      content: n.content,
      eventDate: n.eventDate?.toISOString(),
      targetUserEmail: n.targetUserEmail,
      readBy: n.readBy.map((r) => ({
        userEmail: r.userEmail,
        readAt: r.readAt.toISOString(),
      })),
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
    }));

    return NextResponse.json({ notifications: plain });
  } catch (error) {
    console.error("[admin/notifications GET]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/notifications
 * Create a new notification
 */
export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.type !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, content, eventDate, targetUserEmail } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const now = new Date();
    const notification: Notification = {
      createdByAdminId: new ObjectId(session.adminId),
      type: "manual",
      title: title.trim(),
      content: content.trim(),
      eventDate: eventDate ? new Date(eventDate) : undefined,
      targetUserEmail: targetUserEmail?.trim() || undefined,
      readBy: [],
      createdAt: now,
      updatedAt: now,
    };

    const notificationsColl = await getNotificationsCollection();
    const result = await notificationsColl.insertOne(notification);
    const created = await notificationsColl.findOne({ _id: result.insertedId });

    return NextResponse.json({
      success: true,
      notification: {
        _id: created!._id!.toString(),
        createdByAdminId: created!.createdByAdminId.toString(),
        type: created!.type,
        title: created!.title,
        content: created!.content,
        eventDate: created!.eventDate?.toISOString(),
        targetUserEmail: created!.targetUserEmail,
        readBy: [],
        createdAt: created!.createdAt.toISOString(),
        updatedAt: created!.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[admin/notifications POST]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
