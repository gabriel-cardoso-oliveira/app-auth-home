// import { FeedList } from '@/features/home/ui/FeedList';
import { SafeAreaView } from "react-native-safe-area-context";
import { H4, YStack } from "tamagui";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { AppButton } from "@/shared/components/AppButton";

export default function HomeScreen() {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} padding="$4" gap="$4">
        <H4 textAlign="center" fontSize="$4" color="$color.textPrimary">
          Olá, {user?.email}
        </H4>
        {/* <FeedList /> */}
        <AppButton variant="outlined" onPress={logout}>
          Logout
        </AppButton>
      </YStack>
    </SafeAreaView>
  );
}
