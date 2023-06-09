import axios from "axios";
import { AXIOS_BASE_URL } from '@env'
import "expo-router/entry";

console.log('index.ts');

axios.defaults.baseURL = AXIOS_BASE_URL;