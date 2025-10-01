// import { FeedList } from '@/features/home/ui/FeedList';
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, YStack } from "tamagui";

import { useAuthStore } from "@/features/auth/store/auth.store";

export default function HomeScreen() {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} padding="$4" gap="$4">
        <Text fontSize="$6" fontWeight="bold">
          Olá, {user?.email}
        </Text>
        {/* <FeedList /> */}
        <Button onPress={logout}>Logout</Button>
      </YStack>
    </SafeAreaView>
  );
}
