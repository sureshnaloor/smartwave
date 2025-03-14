export interface User {
  // Personal Info
  firstName: string;
  lastName: string;  // for vCard usage
  familyName: string;  // for MongoDB storage
  middleName: string;
  photo: string;
  birthday: string;

  // Organization Info
  title: string;
  company: string;
  companyLogo: string;

  // Contact Info
  workEmail: string;
  personalEmail: string;
  mobile: string;
  workPhone: string;
  fax: string;
  homePhone: string;

  // Work Address
  workStreet: string;
  workDistrict: string;
  workCity: string;
  workState: string;
  workZipcode: string;
  workCountry: string;

  // Home Address
  homeStreet: string;
  homeDistrict: string;
  homeCity: string;
  homeState: string;
  homeZipcode: string;
  homeCountry: string;

  // Online Presence
  website: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;

  // Additional Info
  notes: string;

  // System fields
  isPremium: boolean;

  // New fields
  name: string;
  workAddress: string;
} 