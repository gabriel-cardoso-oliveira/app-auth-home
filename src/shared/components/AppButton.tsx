import { Button, ButtonProps, Spinner } from "tamagui";

type AppButtonProps = ButtonProps & {
  isLoading?: boolean;
};

export function AppButton({
  isLoading,
  children,
  variant,
  ...props
}: AppButtonProps) {
  const isOutlined = variant === "outlined";

  return (
    <Button
      variant={variant}
      icon={isLoading ? () => <Spinner /> : undefined}
      disabled={isLoading}
      size="$4"
      borderRadius="$6"
      backgroundColor={isOutlined ? "transparent" : "$primary"}
      color={isOutlined ? "$primary" : "$color.background"}
      borderColor={isOutlined ? "$primary" : undefined}
      borderWidth={isOutlined ? 0.5 : undefined}
      {...props}
    >
      {children}
    </Button>
  );
}
