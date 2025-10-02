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
