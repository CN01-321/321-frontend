export type PetType = "dog" | "cat" | "bird" | "rabbit";
export type PetSize = "small" | "medium" | "large";

export type UserType = "owner" | "carer";

export interface Pet {
  _id?: string;
  name: string;
  petType: PetType;
  petSize: PetSize;
  isVaccinated?: boolean;
  isFriendly?: boolean;
  isNeutered?: boolean;
  profilePicture?: string;
}

type RequestStatus = "pending" | "accepted" | "rejected" | "completed";

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
