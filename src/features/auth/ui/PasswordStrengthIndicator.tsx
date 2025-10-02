import { Text, View, XStack, YStack } from "tamagui";

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

const getStrengthLevel = (password: string): StrengthLevel => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  return score as StrengthLevel;
};

const strengthConfig = {
  0: { text: "", color: "$color.gray8Light" },
  1: { text: "Muito Fraca", color: "$color.red10Light" },
  2: { text: "Fraca", color: "$color.orange10Light" },
  3: { text: "Média", color: "$color.yellow10Light" },
  4: { text: "Forte", color: "$color.green10Light" },
};

export function PasswordStrengthIndicator({
  password = "",
}: {
  password?: string;
}) {
  const level = getStrengthLevel(password);
  const { text, color } = strengthConfig[level];

  return (
    <YStack gap="$2">
      <XStack gap="$1.5" jc="space-between">
        {Array.from({ length: 4 }).map((_, index) => (
          <View
            key={index}
            flex={1}
            height={4}
            borderRadius="$12"
            backgroundColor={index < level ? color : "$color.gray5Light"}
          />
        ))}
      </XStack>
      {level > 0 && (
        <Text color={color} fontSize="$4">
          {text}
        </Text>
      )}
    </YStack>
  );
}
