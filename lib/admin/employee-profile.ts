import { ObjectId } from "mongodb";

/** Employee profile created by an admin; stored in collection admin_employee_profiles */
export interface AdminEmployeeProfile {
  _id?: ObjectId;
  createdByAdminId: ObjectId;
  firstName: string;
  lastName: string;
  middleName?: string;
  name: string;
  title?: string;
  company?: string;
  workEmail?: string;
  mobile?: string;
  workPhone?: string;
  workStreet?: string;
  workCity?: string;
  workState?: string;
  workZipcode?: string;
  workCountry?: string;
  website?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function buildName(first: string, middle: string, last: string): string {
  return [first, middle, last].filter(Boolean).join(" ").trim() || "Unknown";
}
