export interface Pet {
  _id?: string;
  name: string;
  petType: "dog" | "cat" | "bird" | "rabbit";
  petSize: "small" | "medium" | "large";
  isVaccinated?: boolean;
  isFriendly?: boolean;
  isNeutered?: boolean;
  profilePicture?: string;
}
