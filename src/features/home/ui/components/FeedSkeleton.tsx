import { memo } from "react";
import { Card, YStack } from "tamagui";

const FeedSkeleton = () => (
  <YStack gap="$3" p="$2" testID="feed-skeleton">
    <Card h={80} bg="$color.gray5Light" />
    <Card h={80} bg="$color.gray5Light" />
    <Card h={80} bg="$color.gray5Light" />
    <Card h={80} bg="$color.gray5Light" />
    <Card h={80} bg="$color.gray5Light" />
    <Card h={80} bg="$color.gray5Light" />
    <Card h={80} bg="$color.gray5Light" />
  </YStack>
);

export default memo(FeedSkeleton);
