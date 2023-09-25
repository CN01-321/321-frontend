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

export interface Owner extends User {}

export interface Carer extends User {
  preferredTravelDistance: number; // distance is in metres
  hourlyRate: number;
  preferredPetTypes: PetType[];
  preferredPetSizes: PetSize[];
}

export interface UserLocation {
  type: "Point"; // the GeoJSON type is always "Point"
  coordinates: [number, number]; // longitude, latitude
  street: string;
  city: string;
  state: string;
  postcode: string;
}

export interface CarerResult {
  _id: string;
  name: string;
  rating?: number;
  bio?: string;
  pfp?: string;
  hourlyRate?: number;
}

export interface NearbyCarer extends CarerResult {
  distance: number;
  totalReviews: number;
  hourlyRate: number;
  preferredPetTypes: PetType[];
  preferredPetSizes: PetSize[];
}

export interface Pet {
  _id: string;
  name: string;
  petType: PetType;
  petSize: PetSize;
  isVaccinated?: boolean;
  isFriendly?: boolean;
  isNeutered?: boolean;
  pfp?: string;
}

export type RequestStatus =
  | "pending"
  | "applied"
  | "accepted"
  | "rejected"
  | "completed";

export interface RequestInfoLocation {
  state: string;
  city: string;
  street: string;
}

export interface RequestInfo {
  _id: string;
  pets: Array<{
    _id: string;
    name: string;
    petType: PetType;
    pfp?: string;
  }>;
  requestedOn: Date;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  location: RequestInfoLocation;
  additionalInfo?: string;
  status: RequestStatus;
}

export interface Request extends RequestInfo {
  carer?: {
    _id: string;
    name: string;
  };
}

export type JobType = "direct" | "broad" | "job";
export type OfferType = Omit<JobType, "job">;

export interface Job extends RequestInfo {
  ownerId: string;
  ownerName: string;
  ownerIcon?: string;
}

export interface SelectorItem<T> {
  key: T;
  name: string;
}

export const petSelectorTypes: SelectorItem<PetType>[] = [
  { key: "dog", name: "Dog" },
  { key: "cat", name: "Cat" },
  { key: "bird", name: "Bird" },
  { key: "rabbit", name: "Rabbit" },
];

export const petSelectorSizes: SelectorItem<PetSize>[] = [
  { key: "small", name: "1-20 kg" },
  { key: "medium", name: "20-40 kg" },
  { key: "large", name: "40+ kg" },
];
