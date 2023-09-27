import axios from "axios";
import { RequestInfo } from "../types/types";
import { Notification } from "../app/(authed)/notifications";

export async function fetchData<T>(
  endpoint: string,
  onSet: (data: T) => void,
  onError?: (err: unknown) => void
) {
  try {
    const { data } = await axios.get<T>(endpoint);
    onSet(data);
  } catch (err) {
    console.error(err);
    onError && onError(err);
  }
}

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

export async function fetchNotifications() {
  const { data } = await axios.get<Notification[]>("/users/notifications");

  return data
    .map((n) => {
      n.notifiedOn = new Date(n.notifiedOn);
      return n;
    })
    .sort((n1, n2) => n2.notifiedOn.getTime() - n1.notifiedOn.getTime());
}
