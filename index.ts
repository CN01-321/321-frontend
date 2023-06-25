import axios from "axios";
import { AXIOS_BASE_URL } from "@env";
import "expo-router/entry";

try {
  console.log("index.ts");
} catch (e) {
  console.error(e);
}

axios.defaults.baseURL = AXIOS_BASE_URL;
