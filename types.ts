export const CARER_COLOUR = "#a87351";
export const OWNER_COLOUR = "#e2ac54";
export const ERROR_COLOUR = "#eb2c2c";
export const SUCCESS_COLOUR = "#527c3f";
export const COMPLETED_COLOUR = "#3b5998";

export type PetType = "dog" | "cat" | "bird" | "rabbit";
export type PetSize = "small" | "medium" | "large";

export type UserType = "owner" | "carer";

export interface User {
  _id: string;
  name: string;
  email: string;
  location?: UserLocation;
  userType: UserType;
  bio?: string;
  phone?: string;
  pfp?: string;
}

export interface UserLocation {
    type: "Point"; // the GeoJSON type is always "Point"
    coordinates: [number, number]; // longitude, latitude
    street: string;
    city: string;
    state: string;
    postcode: string;
  }

export interface Pet {
  _id: string;
  name: string;
  petType: PetType;
  petSize: PetSize;
  isVaccinated?: boolean;
  isFriendly?: boolean;
  isNeutered?: boolean;
  profilePicture?: string;
}

export type RequestStatus =
  | "pending"
  | "applied"
  | "accepted"
  | "rejected"
  | "completed";

export interface RequestInfo {
  _id: string;
  pets: Array<{
    _id: string;
    name: string;
    petType: PetType;
  }>;
  requestedOn: Date;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  location: {
    state: string;
    city: string;
    street: string;
  };
  additionalInfo: string;
  status: RequestStatus;
  pfp?: string;
}

export interface Request extends RequestInfo {
  carer?: {
    _id: string;
    name: string;
  };
}

export type JobType = "direct" | "broad" | "job";

export interface Job extends RequestInfo {
  ownerId: string;
  ownerName: string;
  ownerIcon?: string;
}
