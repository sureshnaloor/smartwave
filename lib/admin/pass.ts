import { ObjectId } from "mongodb";

/** Event or access pass created by an admin; stored in collection admin_passes */
export type AdminPassType = "event" | "access";

/** Category for passes - used for filtering and organization */
export type PassCategory = "all" | "concerts" | "workplace" | "events" | "retail" | "access" | "community" | "temples" | "spiritual";

export interface AdminPass {
  _id?: ObjectId;
  createdByAdminId: ObjectId;
  name: string;
  description?: string;
  type: AdminPassType;
  category?: PassCategory; // New field for categorization
  location?: {
    lat?: number;
    lng?: number;
    name: string;
    address?: string; // Full Google Maps address
  };
  dateStart?: Date;
  dateEnd?: Date;
  tags?: string[];
  status: "draft" | "active";
  createdAt: Date;
  updatedAt: Date;
}

/** User pass membership - tracks which users have joined which passes */
export interface UserPassMembership {
  _id?: ObjectId;
  userId: ObjectId; // Reference to users collection
  userEmail: string;
  passId: ObjectId; // Reference to admin_passes collection
  status: "pending" | "approved" | "rejected"; // Approval status
  requestedAt: Date;
  approvedAt?: Date;
  approvedBy?: ObjectId; // Admin/SuperAdmin who approved
  rejectedAt?: Date;
  rejectedBy?: ObjectId;
  addedToWallet?: boolean; // Track if user added to wallet
  walletAddedAt?: Date;
}
