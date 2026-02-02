import { ObjectId } from "mongodb";

/** Admin user created by super admin; stored in MongoDB collection `adminusers` */
export interface AdminUser {
  _id: ObjectId;
  email: string;
  username: string;
  password: string; // bcrypt hash
  firstLoginDone: boolean;

  /** Company details shared with employees */
  company?: {
    name: string;
    email: string;
    logo?: string;
    address?: string;
    location?: {
      name?: string;
      lat?: number;
      lng?: number;
    };
  };
  limits: {
    profiles: number;
    passes: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

/** Session payload stored in cookie (JWT) */
export type AdminSessionPayload =
  | { type: "super" }
  | { type: "admin"; adminId: string; email: string; username: string; limits: AdminUser["limits"] };

/** Default limits for new admin users */
export const DEFAULT_ADMIN_LIMITS = { profiles: 10, passes: 5 };
