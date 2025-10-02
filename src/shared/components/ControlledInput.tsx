import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input, InputProps, Text, YStack } from "tamagui";

type ControlledInputProps<T extends FieldValues> = InputProps & {
  control: Control<T>;
  name: Path<T>;
};

export function ControlledInput<T extends FieldValues>({
  control,
  name,
  ...props
}: ControlledInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <YStack>
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            size="$4"
            borderRadius="$6"
            color="$color.textPrimary"
            borderColor={error ? "$color.red10Light" : "$color.cardBorder"}
            {...props}
          />
          {error && (
            <Text color="$color.red10Light" fontSize="$4" mt="$1">
              {error.message}
            </Text>
          )}
        </YStack>
      )}
    />
  );
}
