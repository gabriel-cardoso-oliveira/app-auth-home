import { memo } from "react";
import { Text, View } from "tamagui";

const OfflineBanner = () => (
  <View bg="$orange8" p="$2" borderRadius="$3">
    <Text color="$color" fontSize="$4" textAlign="center">
      Você está vendo dados offline. Conecte-se à internet para atualizar.
    </Text>
  </View>
);

export default memo(OfflineBanner);
