import { Text, TextProps } from "tamagui";

interface FormErrorProps extends TextProps {
  message?: string;
}

export function FormError({ message, ...props }: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <Text color="$color.red10Light" fontSize="$4" textAlign="center" {...props}>
      {message}
    </Text>
  );
}
