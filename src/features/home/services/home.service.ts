import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "@/core/axios";

const CACHE_KEY = "@home_feed_cache";

interface FeedItem {
  id: string;
  title: string;
  subtitle: string;
  createdAt: string;
}

interface HomeFeedResponse {
  items: FeedItem[];
}

export const getHomeFeed = async () => {
  try {
    const { data } = await api.get<HomeFeedResponse>("/mock/home-feed");
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data.items));
    return { items: data.items, fromCache: false };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedData) {
      return { items: JSON.parse(cachedData), fromCache: true };
    }
    throw new Error("Não foi possível carregar o feed. Tente mais tarde.");
  }
};
