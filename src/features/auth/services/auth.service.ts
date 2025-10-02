import api from "@/core/axios";

import { User } from "../store/auth.store";
import { CreatePasswordData, LoginData } from "../validators/auth.validators";

export type LoginCredentials = LoginData;

interface LoginResponse {
  user: User;
  accessToken: string;
}

export const login = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  try {
    const { data } = await api.post<LoginResponse>(
      "/mock/auth/login",
      credentials,
    );
    return data;
  } catch (error: any) {
    if (
      error.response &&
      (error.response.status === 400 || error.response.status === 401)
    ) {
      throw new Error(
        error.response.data.message || "E-mail/CPF ou senha inválidos.",
      );
    }
    throw new Error("Não foi possível fazer login. Tente mais tarde.");
  }
};

export const createPassword = async (credentials: CreatePasswordData) => {
  try {
    const { data } = await api.post("/mock/auth/create-password", credentials);
    return data;
  } catch (error: any) {
    if (
      error.response &&
      (error.response.status === 400 || error.response.status === 401)
    ) {
      throw new Error(
        error.response.data.message || "E-mail/CPF ou senha inválidos.",
      );
    }
    throw new Error("Não foi possível criar a senha. Tente mais tarde.");
  }
};
