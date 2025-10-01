import { Redirect, Slot } from "expo-router";

import { useAuthStore } from "@/features/auth/store/auth.store";

export default function AppLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}
