import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { memo } from "react";
import { Card, Text, XStack, YStack } from "tamagui";

import { FeedItem } from "../../store/home.store";

export interface FeedItemCardProps {
  item: FeedItem;
}

const FeedItemCard = ({ item }: FeedItemCardProps) => (
  <Card p="$3" bordered borderColor="$color.cardBorder" bg="transparent">
    <YStack gap="$2" py="$2">
      <XStack justifyContent="space-between">
        <Text fontWeight="bold">{item.title}</Text>
        <Text color="$textSecondary">
          {format(new Date(item.createdAt), "dd/MM/yyyy", {
            locale: ptBR,
          })}
        </Text>
      </XStack>
      <Text fontSize="$4" color="$textSecondary">
        {item.subtitle}
      </Text>
    </YStack>
  </Card>
);

export default memo(FeedItemCard);
