import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";

import { useAuthStore } from "@/features/auth/store/auth.store";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}
