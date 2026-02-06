import { ObjectId } from "mongodb";

export type NotificationType = 
  | "manual" 
  | "system_pass_created" 
  | "system_access_request" 
  | "system_pass_approved"
  | "system_company_news";

export interface Notification {
  _id?: ObjectId;
  createdByAdminId: ObjectId;
  type: NotificationType;
  title: string;
  content: string; // Rich text HTML
  eventDate?: Date; // Optional calendar date for events
  targetUserEmail?: string; // null = all company employees
  readBy: Array<{
    userEmail: string;
    readAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
