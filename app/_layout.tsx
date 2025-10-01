import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { TamaguiProvider, YStack } from "tamagui";

import { tamaguiConfig } from "@/design/theme";
import { useAuthStore } from "@/features/auth/store/auth.store";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { restoreSession } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    async function prepareApp() {
      try {
        await Promise.all([fontsLoaded, restoreSession()]);
      } catch (e) {
        throw e;
      } finally {
        setAppReady(true);
      }
    }

    if (fontsLoaded || fontError) {
      prepareApp();
    }
  }, [fontsLoaded, fontError, restoreSession]);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <YStack flex={1} backgroundColor="$background">
        <StatusBar style="dark" />
        <Slot />
      </YStack>
    </TamaguiProvider>
  );
}
