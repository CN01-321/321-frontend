import {
  CarerProfile,
  Job,
  NearbyCarer,
  OwnerProfile,
  Pet,
  PetSize,
  PetType,
  Request,
  RequestInfoLocation,
  petSelectorSizes,
  petSelectorTypes,
} from "../types/types";
import { Filters } from "../app/(authed)/owner/search";
import { NotifTimeBucket, Notification } from "../app/(authed)/notifications";

export function getSelectorPetType(petType: PetType) {
  return petSelectorTypes.find((p) => p.key === petType);
}

export function getSelectorPetSize(petSize: PetSize) {
  return petSelectorSizes.find((p) => p.key === petSize);
}

export function getPetStatuses(pet: Pet) {
  return new Map([
    ["isVaccinated", pet.isVaccinated ?? false],
    ["isFriendly", pet.isFriendly ?? false],
    ["isNeutered", pet.isNeutered ?? false],
  ]);
}

export function isOwner(
  user: OwnerProfile | CarerProfile
): user is OwnerProfile {
  return user.userType === "owner";
}

export function filterCarers(filters: Filters, carers: NearbyCarer[]) {
  const selectedPetTypes = Array.from(filters.petTypes.entries())
    .filter(([, selected]) => selected)
    .map(([petType]) => petType);

  const selectedPetSizes = Array.from(filters.petSizes.entries())
    .filter(([, selected]) => selected)
    .map(([petSize]) => petSize);

  const results = [];

  for (const carer of carers) {
    // check if carer's hourly rate is less than then max price
    if (filters.maxPrice && filters.maxPrice < carer.hourlyRate) {
      continue;
    }

    // check that the carer can care for all selected pets
    if (
      !selectedPetTypes.every((petType) =>
        carer.preferredPetTypes.includes(petType)
      )
    ) {
      continue;
    }

    // check the carer can care for all selected sizes
    if (
      !selectedPetSizes.every((petSize) =>
        carer.preferredPetSizes.includes(petSize)
      )
    ) {
      continue;
    }

    // check the carer meets the minimum rating
    if (filters.minRating && filters.minRating > (carer.rating ?? -1)) {
      continue;
    }

    results.push(carer);
  }

  return results;
}

export function isPastJob(job: Job) {
  return job.status === "rejected" || job.status === "completed";
}

export function isPastRequest(request: Request) {
  return request.status === "rejected" || request.status === "completed";
}

export function sinceRequested(date: Date) {
  const duration = getDuration(date, new Date());
  if (duration === "now") {
    return duration;
  }

  return `${duration} ago`;
}

export function toDDMMYYYY(date: Date) {
  const day = date.getDate();
  const month = date.getMonth().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getDuration(start: Date, end: Date) {
  const diff = end.getTime() - start.getTime();

  // if diff less than a minute ago show "now"
  const mins = Math.floor(diff / (1000 * 60));
  // <= 0 to catch minor time variations between backend on new requests
  if (mins <= 0) {
    return "now";
  }

  // if the diff less than an hour ago show "mins ago"
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (Math.floor(diff / (1000 * 60 * 60)) === 0) {
    return `${mins} min${mins === 1 ? "" : "s"}`;
  }

  // if less than a day show "hours ago"
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) {
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  return `${days} day${days === 1 ? "" : "s"}`;
}

export function locationToString(location: RequestInfoLocation) {
  return `${location.street}, ${location.city}, ${location.state}`;
}

export function calculateTotalCost(
  hourlyRate: number,
  start: Date,
  end: Date
): number {
  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return hours * hourlyRate;
}

export function getNotificationTitle(notification: Notification) {
  switch (notification.notificationType) {
    case "recievedDirect":
      return "You Have a New Job Offer";
    case "recievedFeedback":
      return "You Have Some New Feedback";
    case "acceptedDirect":
      return "Your Request Has Been Accepted";
    case "acceptedBroad":
      return "You Have Been Accepted for a Job";
  }
}

export function getNotificationSubject(notification: Notification) {
  switch (notification.notificationType) {
    case "recievedDirect":
      return `${notification.subjectName} has offered you a job`;
    case "recievedFeedback":
      return `${notification.subjectName} has left some feedback`;
    case "acceptedDirect":
      return `${notification.subjectName} has accepted your request`;
    case "acceptedBroad":
      return `${notification.subjectName} has hired you for the job`;
  }
}

export async function sortNotifications(
  notifications: Notification[]
): Promise<NotifTimeBucket[]> {
  const today: Notification[] = [];
  const thisMonth: Notification[] = [];
  const older: Notification[] = [];

  const now = new Date();

  for (const notif of notifications) {
    // if not in the same month of the same year as now then push to older
    if (
      !(
        notif.notifiedOn.getMonth() === now.getMonth() &&
        notif.notifiedOn.getFullYear() === now.getFullYear()
      )
    ) {
      older.push(notif);
      break;
    }

    // if the same day as today then push to today, otherwise push to last month
    if (notif.notifiedOn.getDay() === now.getDay()) {
      today.push(notif);
    } else {
      thisMonth.push(notif);
    }
  }

  return [
    { title: "TODAY", data: today },
    { title: "THIS MONTH", data: thisMonth },
    { title: "OLDER", data: older },
  ];
}

export function verifyPassword(password: string): true | string {
  if (password.length < 8) {
    return "Password should have at least 8 characters";
  }

  if (!password.match(/[A-Z]/)) {
    return "Password should have an upper case letter";
  }

  if (!password.match(/[0-9]/)) {
    return "Password should have a digit";
  }

  return true;
}
