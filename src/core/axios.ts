import axios, { AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";
import * as SecureStore from "expo-secure-store";

import { LoginData } from "@/features/auth/validators/auth.validators";

import homeFeedData from "../../mock/data/home-feed.json";

const api = axios.create({
  baseURL: "/",
  timeout: 5000,
});

api.interceptors.request.use(
  async (config) => {
    const { useAuthStore } = await import("@/features/auth/store/auth.store");

    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(response);
      }, 1000);
    }),
  (error) =>
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(error);
      }, 1000);
    }),
);

export default api;

const mock = new MockAdapter(api, { delayResponse: 0 });

const MOCK_TOKEN = "fake-jwt-token";

mock.onPost("/mock/auth/create-password").reply(async (config) => {
  const user = JSON.parse(config.data);
  await SecureStore.setItemAsync(user.email, user.password);
  return [200, { accessToken: MOCK_TOKEN, user }];
});

mock
  .onPost("/mock/auth/login")
  .reply(async (config: AxiosRequestConfig<LoginData>) => {
    if (!config.data) {
      return [400, { message: "Dados inválidos" }];
    }

    const { documentOrEmail, password } = config.data;
    const storedPassword = await SecureStore.getItemAsync(documentOrEmail);
    if (storedPassword && storedPassword === password) {
      return [
        200,
        {
          accessToken: MOCK_TOKEN,
          user: { email: documentOrEmail },
        },
      ];
    }
    return [401, { message: "Credenciais inválidas" }];
  });

mock.onGet("/mock/home-feed").reply(200, homeFeedData);
