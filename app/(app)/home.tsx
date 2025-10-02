import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { H4, YStack } from "tamagui";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { HomeFeed } from "@/features/home/ui/HomeFeed";
import { AppButton } from "@/shared/components/AppButton";

export default function HomeScreen() {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          onPress: logout,
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <YStack f={1} backgroundColor="$background" padding="$4" gap="$4">
      <SafeAreaView style={{ flex: 1 }}>
        <YStack gap="$3" f={1}>
          <H4 fontSize="$6" color="$color.textPrimary">
            Bem vindo!
          </H4>

          <HomeFeed />

          <AppButton onPress={handleLogout} variant="outlined">
            Sair
          </AppButton>
        </YStack>
      </SafeAreaView>
    </YStack>
  );
}
