import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { User } from "@/features/auth/store/auth.store";
import {
  CreatePasswordData,
  LoginData,
} from "@/features/auth/validators/auth.validators";

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
  if (!config.data) {
    return [400, { message: "Dados inválidos" }];
  }

  const users = (await AsyncStorage.getItem("users")) || "[]";
  const user = JSON.parse(config.data) as CreatePasswordData;

  const existingUser = users
    ? JSON.parse(users).find(
        (eUser: User) => eUser.email === user.documentOrEmail,
      )
    : null;

  if (existingUser) {
    return [400, { message: "Usuário já existe" }];
  }

  const newData = users
    ? JSON.stringify([
        ...JSON.parse(users),
        { email: user.documentOrEmail, password: user.password },
      ])
    : JSON.stringify([
        { email: user.documentOrEmail, password: user.password },
      ]);

  await AsyncStorage.setItem("users", newData);

  return [
    200,
    { accessToken: MOCK_TOKEN, user: { email: user.documentOrEmail } },
  ];
});

mock.onPost("/mock/auth/login").reply(async (config) => {
  if (!config.data) {
    return [400, { message: "Dados inválidos" }];
  }

  const users = await AsyncStorage.getItem("users");
  if (!users) {
    return [400, { message: "Usuário não encontrado" }];
  }

  const { documentOrEmail, password } = JSON.parse(config.data) as LoginData;

  const storedPassword = JSON.parse(users).find(
    (user: User) => user.email === documentOrEmail,
  );

  if (storedPassword && storedPassword.password === password) {
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
