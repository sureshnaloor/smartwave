import type { ProfileData } from "@/app/_actions/profile";

export const REQUIRED_PROFILE_FIELDS_MESSAGE =
  "Fill in First Name, either Middle Name or Last Name, Job Title, and Company before using profile actions.";

export function hasRequiredProfileFields(profile?: Partial<ProfileData> | null) {
  return (
    Boolean(profile?.firstName?.trim()) &&
    (Boolean(profile?.middleName?.trim()) || Boolean(profile?.lastName?.trim())) &&
    Boolean(profile?.title?.trim()) &&
    Boolean(profile?.company?.trim())
  );
}
