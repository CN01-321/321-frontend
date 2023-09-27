import {
  CarerProfile,
  Job,
  NearbyCarer,
  OwnerProfile,
  Request,
  RequestInfoLocation,
} from "../types/types";
import { Filters } from "../app/(authed)/owner/search";

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
    if (filters.maxPrice && carer.hourlyRate > filters.maxPrice) {
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
  const duration = getDuration(new Date(), date);
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
