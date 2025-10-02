import { useEffect } from "react";
import { FlatList } from "react-native";
import { View, YStack } from "tamagui";

import { FormError } from "@/shared/components/FormError";

import { useHomeStore } from "../store/home.store";
import FeedItemCard from "./components/FeedItemCard";
import FeedSkeleton from "./components/FeedSkeleton";
import OfflineBanner from "./components/OfflineBanner";

export function HomeFeed() {
  const { feedItems, status, isOffline, fetchFeed } = useHomeStore();

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  if (status === "loading") {
    return <FeedSkeleton />;
  }

  if (status === "error") {
    return <FormError message="Ocorreu um erro ao carregar o feed." />;
  }

  return (
    <YStack gap="$3" f={1}>
      {isOffline && <OfflineBanner />}
      <FlatList
        data={feedItems}
        renderItem={({ item }) => <FeedItemCard item={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View h="$0.75" />}
      />
    </YStack>
  );
}
