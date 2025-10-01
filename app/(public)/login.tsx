import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack } from "tamagui";

export default function LoginScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} justifyContent="center" padding="$4">
        <Text>Página de Login</Text>
      </YStack>
    </SafeAreaView>
  );
}
