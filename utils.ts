import axios from "axios";
import { RequestInfo, RequestInfoLocation } from "./types/types";

export async function fetchRequestInfo<T extends RequestInfo>(
  endpoint: string
) {
  const { data } = await axios.get<T[]>(endpoint);

  const info = data.map((i) => {
    i.requestedOn = new Date(i.requestedOn);
    i.dateRange.startDate = new Date(i.dateRange.startDate);
    i.dateRange.endDate = new Date(i.dateRange.endDate);
    return i;
  });

  return info;
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
  console.log(hours);
  return hours * hourlyRate;
}
