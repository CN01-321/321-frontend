import { StyleSheet, Text, View } from "react-native";
import Home from "./home";
import Landing from "./landing";
import { useState } from "react";
import { useRouter } from "expo-router";

const authorised = true;

export default function Main() {
  const router = useRouter();

  if (authorised) {
    router.replace("/home");
  }

  return (
      <Landing /> 
  );
}
