import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import * as SecureStore from "expo-secure-store";

import { useAuthStore } from "@/features/auth/store/auth.store";

import homeFeedData from "../../mock/data/home-feed.json";

const api = axios.create({
  baseURL: "/",
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
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

mock.onPost("/mock/auth/login").reply(async (config) => {
  const { email, password } = JSON.parse(config.data);
  const storedPassword = await SecureStore.getItemAsync(email);
  if (storedPassword && storedPassword === password) {
    return [
      200,
      {
        accessToken: MOCK_TOKEN,
        user: { email },
      },
    ];
  }
  return [401, { message: "Credenciais inválidas" }];
});

mock.onGet("/mock/home-feed").reply(200, homeFeedData);
