import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Form, H4 } from "tamagui";

import { AppButton } from "@/shared/components/AppButton";
import { ControlledInput } from "@/shared/components/ControlledInput";
import { FormError } from "@/shared/components/FormError";

import { login, LoginCredentials } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { LoginData, loginSchema } from "../validators/auth.validators";

export function LoginForm() {
  const { login: loginUser } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setFocus,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      const { user, accessToken } = await login(data);
      await loginUser(user, accessToken);
      router.replace("/home");
    } catch (error: any) {
      setError("root.serverError", {
        type: "manual",
        message: error.message || "Credenciais inválidas. Tente novamente.",
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} gap="$5">
      <H4 textAlign="center" fontSize="$6" color="$color.textPrimary">
        Acessar Conta
      </H4>

      <ControlledInput<LoginData>
        control={control}
        name="documentOrEmail"
        placeholder="CPF ou E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => setFocus("password")}
      />

      <ControlledInput<LoginData>
        control={control}
        name="password"
        placeholder="Senha"
        secureTextEntry
        textContentType="password"
        returnKeyType="send"
        onSubmitEditing={handleSubmit(onSubmit)}
      />

      <FormError message={errors.root?.serverError?.message} />

      <Form.Trigger asChild disabled={isSubmitting}>
        <AppButton testID="login-button-submit" isLoading={isSubmitting}>
          Entrar
        </AppButton>
      </Form.Trigger>

      <AppButton
        onPress={() => router.push("/create-password")}
        variant="outlined"
      >
        Criar senha
      </AppButton>
    </Form>
  );
}
