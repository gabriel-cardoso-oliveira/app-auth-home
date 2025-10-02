import { z } from "zod";

export const loginSchema = z.object({
  documentOrEmail: z
    .string({ error: "O e-mail ou CPF é obrigatório." })
    .min(1, "O e-mail ou CPF é obrigatório.")
    .refine(
      (value) => {
        const isEmail = z.string().email().safeParse(value).success;
        const isCpf = /^\d{11}$/.test(value.replace(/[^\d]/g, ""));
        return isEmail || isCpf;
      },
      {
        message: "Formato de e-mail ou CPF inválido.",
      },
    ),
  password: z
    .string({ error: "A senha é obrigatória." })
    .min(1, "A senha é obrigatória."),
});

export type LoginData = z.infer<typeof loginSchema>;

export const createPasswordSchema = z
  .object({
    documentOrEmail: z
      .string({ error: "O e-mail ou CPF é obrigatório." })
      .min(1, "O e-mail ou CPF é obrigatório.")
      .refine(
        (value) => {
          const isEmail = z.string().email().safeParse(value).success;
          const isCpf = /^\d{11}$/.test(value.replace(/[^\d]/g, ""));
          return isEmail || isCpf;
        },
        {
          message: "Formato de e-mail ou CPF inválido.",
        },
      ),
    password: z
      .string({ error: "A senha é obrigatória." })
      .min(8, "A senha deve ter no mínimo 8 caracteres.")
      .regex(/[A-Z]/, "Deve conter ao menos uma letra maiúscula.")
      .regex(/[a-z]/, "Deve conter ao menos uma letra minúscula.")
      .regex(/[0-9]/, "Deve conter ao menos um número."),
    confirmPassword: z.string({
      error: "A confirmação de senha é obrigatória.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type CreatePasswordData = z.infer<typeof createPasswordSchema>;
