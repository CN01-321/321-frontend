import { AXIOS_BASE_URL } from "@env";

export function getPfpUrl(pfp: string) {
  return AXIOS_BASE_URL + "/images/" + pfp;
}
