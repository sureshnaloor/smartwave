import { ObjectId } from "mongodb";

/** Event or access pass created by an admin; stored in collection admin_passes */
export type AdminPassType = "event" | "access";

export interface AdminPass {
  _id?: ObjectId;
  createdByAdminId: ObjectId;
  name: string;
  description?: string;
  type: AdminPassType;
  /** Optional: for future opt-in by location/interest */
  location?: string;
  tags?: string[];
  status: "draft" | "active";
  createdAt: Date;
  updatedAt: Date;
}
