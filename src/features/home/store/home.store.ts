import { create } from "zustand";

import { getHomeFeed } from "../services/home.service";

export interface FeedItem {
  id: string;
  title: string;
  subtitle: string;
  createdAt: string;
}

interface HomeState {
  feedItems: FeedItem[];
  status: "idle" | "loading" | "success" | "error";
  isOffline: boolean;
  fetchFeed: () => Promise<void>;
}

export const useHomeStore = create<HomeState>((set) => ({
  feedItems: [],
  status: "idle",
  isOffline: false,
  fetchFeed: async () => {
    set({ status: "loading" });
    try {
      const { items, fromCache } = await getHomeFeed();
      set({ feedItems: items, status: "success", isOffline: fromCache });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      set({ status: "error" });
    }
  },
}));
