import { Button, ButtonProps, Spinner } from "tamagui";

type AppButtonProps = ButtonProps & {
  isLoading?: boolean;
};

export function AppButton({ isLoading, children, ...props }: AppButtonProps) {
  return (
    <Button
      icon={isLoading ? () => <Spinner /> : undefined}
      disabled={isLoading}
      size="$4"
      borderRadius="$6"
      backgroundColor="$primary"
      color="$color.background"
      {...props}
    >
      {children}
    </Button>
  );
}
