import { ObjectId } from "mongodb";
import { getNotificationsCollection } from "./db";
import type { Notification } from "./notification";
import clientPromise from "@/lib/mongodb";

/**
 * Create a system notification for all employees of a company
 */
export async function createSystemNotification(
  adminId: ObjectId,
  type: Notification["type"],
  title: string,
  content: string,
  eventDate?: Date,
  targetUserEmail?: string
): Promise<void> {
  try {
    const notificationsColl = await getNotificationsCollection();
    const now = new Date();

    const notification: Notification = {
      createdByAdminId: adminId,
      type,
      title,
      content,
      eventDate,
      targetUserEmail,
      readBy: [],
      createdAt: now,
      updatedAt: now,
    };

    await notificationsColl.insertOne(notification);
  } catch (error) {
    console.error("[createSystemNotification]", error);
    // Don't throw - notifications are non-critical
  }
}

/**
 * Create notification when a new pass is created
 */
export async function notifyPassCreated(
  adminId: ObjectId,
  passName: string,
  passId: string
): Promise<void> {
  await createSystemNotification(
    adminId,
    "system_pass_created",
    "New Pass Available",
    `A new pass "<strong>${passName}</strong>" is now available. Check it out in the Passes section!`,
    undefined,
    undefined // All employees
  );
}

/**
 * Create notification when an access request is made
 */
export async function notifyAccessRequest(
  adminId: ObjectId,
  userName: string,
  userEmail: string,
  passName: string
): Promise<void> {
  await createSystemNotification(
    adminId,
    "system_access_request",
    "New Access Request",
    `<strong>${userName}</strong> (${userEmail}) has requested access to "<strong>${passName}</strong>".`,
    undefined,
    undefined // Admin sees this, but we'll filter on frontend
  );
}

/**
 * Create notification when a pass is approved for an employee
 */
export async function notifyPassApproved(
  adminId: ObjectId,
  userEmail: string,
  passName: string
): Promise<void> {
  await createSystemNotification(
    adminId,
    "system_pass_approved",
    "Pass Request Approved",
    `Your request to join "<strong>${passName}</strong>" has been approved! You can now add it to your wallet.`,
    undefined,
    userEmail // Specific user
  );
}
