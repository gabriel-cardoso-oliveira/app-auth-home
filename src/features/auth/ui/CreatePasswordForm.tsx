import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Form, H4 } from "tamagui";

import { AppButton } from "@/shared/components/AppButton";
import { ControlledInput } from "@/shared/components/ControlledInput";
import { FormError } from "@/shared/components/FormError";
import { PasswordStrengthIndicator } from "@/shared/components/PasswordStrengthIndicator";

import { createPassword } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import {
  CreatePasswordData,
  createPasswordSchema,
} from "../validators/auth.validators";

export function CreatePasswordForm() {
  const { login: loginUser } = useAuthStore();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    setFocus,
    getFieldState,
  } = useForm<CreatePasswordData>({
    resolver: zodResolver(createPasswordSchema),
    mode: "onBlur",
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: CreatePasswordData) => {
    try {
      const { user, accessToken } = await createPassword(data);
      await loginUser(user, accessToken);
      router.replace("/home");
    } catch (error: any) {
      setError("root.serverError", {
        type: "manual",
        message: error.message || "Ocorreu um erro.",
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} gap="$4">
      <H4 textAlign="center" fontSize="$6" color="$color.textPrimary">
        Criar Senha
      </H4>

      <ControlledInput<CreatePasswordData>
        control={control}
        name="documentOrEmail"
        placeholder="CPF ou E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => setFocus("password")}
      />

      <ControlledInput<CreatePasswordData>
        control={control}
        name="password"
        placeholder="Senha"
        secureTextEntry
        textContentType="password"
        returnKeyType="next"
        onSubmitEditing={() => setFocus("confirmPassword")}
      />

      {getFieldState("password").isDirty && (
        <PasswordStrengthIndicator password={passwordValue} />
      )}

      <ControlledInput<CreatePasswordData>
        control={control}
        name="confirmPassword"
        placeholder="Confirmar Senha"
        secureTextEntry
        textContentType="password"
        returnKeyType="send"
        onSubmitEditing={handleSubmit(onSubmit)}
      />

      <FormError message={errors.root?.serverError?.message} />

      <Form.Trigger asChild disabled={isSubmitting}>
        <AppButton isLoading={isSubmitting}>Criar e Acessar</AppButton>
      </Form.Trigger>

      <AppButton
        variant="outlined"
        onPress={() => router.back()}
        disabled={isSubmitting}
      >
        Voltar
      </AppButton>
    </Form>
  );
}
