import { AXIOS_BASE_URL } from "@env";
import axios from "axios";
import "expo-router/entry";

axios.defaults.baseURL = AXIOS_BASE_URL;
