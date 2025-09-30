import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import api from "@/core/axios";

interface User {
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createPassword: (email: string, password: string) => Promise<void>;
  restoreSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/mock/auth/login", { email, password });
      const { accessToken, user } = res.data;
      await SecureStore.setItemAsync("accessToken", accessToken);
      await AsyncStorage.setItem("userProfile", JSON.stringify(user));
      set({ accessToken, user, isAuthenticated: true, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },
  logout: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await AsyncStorage.removeItem("userProfile");
    set({ user: null, accessToken: null, isAuthenticated: false });
    router.replace("/login");
  },
  restoreSession: async () => {
    set({ isLoading: true });
    const token = await SecureStore.getItemAsync("accessToken");
    const userProfile = await AsyncStorage.getItem("userProfile");

    if (token && userProfile) {
      set({
        user: JSON.parse(userProfile),
        accessToken: token,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }

    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
    return false;
  },
  createPassword: async (email, password) => {
    set({ isLoading: true });
    const res = await api.post("/mock/auth/create-password", {
      email,
      password,
    });
    const { accessToken, user } = res.data;
    await SecureStore.setItemAsync("token", accessToken);
    await AsyncStorage.setItem("profile", JSON.stringify(user));
    set({ accessToken, user, isLoading: false });
  },
}));
