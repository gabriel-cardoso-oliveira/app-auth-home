import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
  login: async (user, accessToken) => {
    set({ isLoading: true });
    await SecureStore.setItemAsync("accessToken", accessToken);
    await AsyncStorage.setItem("userProfile", JSON.stringify(user));
    set({ accessToken, user, isAuthenticated: true, isLoading: false });
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
}));
