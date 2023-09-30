import { LogBox } from "react-native";
import axios from "axios";
import "expo-router/entry";

axios.defaults.baseURL = process.env.AXIOS_BASE_URL;

// Ignore Stack deprecation warning as this is a bug in expo router
// https://github.com/expo/router/issues/834
LogBox.ignoreLogs([
  "The `redirect` prop on <Screen /> is deprecated and will be removed. Please use `router.redirect` instead",
]);
