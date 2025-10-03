import { act, renderHook } from "@testing-library/react-native";

import { FeedItem, useHomeStore } from "@/features/home/store/home.store";

import { getHomeFeed } from "../../features/home/services/home.service";

jest.mock("@/features/home/services/home.service");

const mockedGetHomeFeed = getHomeFeed as jest.Mock;

const mockFeed: FeedItem[] = [
  {
    id: "1",
    title: "Test Item 1",
    subtitle: "Subtitle 1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Test Item 2",
    subtitle: "Subtitle 2",
    createdAt: new Date().toISOString(),
  },
];

describe("features/home/store/home.store", () => {
  const initialState = useHomeStore.getState();

  beforeEach(() => {
    useHomeStore.setState(initialState);
    jest.clearAllMocks();
  });

  it("should have the correct initial state", () => {
    const { result } = renderHook(() => useHomeStore());

    expect(result.current.feedItems).toEqual([]);
    expect(result.current.status).toBe("idle");
    expect(result.current.isOffline).toBe(false);
  });

  describe("fetchFeed", () => {
    it("should update state correctly on successful fetch", async () => {
      mockedGetHomeFeed.mockResolvedValue({
        items: mockFeed,
        fromCache: false,
      });

      const { result } = renderHook(() => useHomeStore());

      act(() => {
        result.current.fetchFeed();
      });

      expect(result.current.status).toBe("loading");

      await act(async () => {
        await mockedGetHomeFeed.getMockImplementation()!();
      });

      expect(result.current.status).toBe("success");
      expect(result.current.feedItems).toEqual(mockFeed);
      expect(result.current.isOffline).toBe(false);
    });

    it("should set isOffline to true when data is from cache", async () => {
      mockedGetHomeFeed.mockResolvedValue({ items: mockFeed, fromCache: true });

      const { result } = renderHook(() => useHomeStore());

      await act(() => result.current.fetchFeed());

      expect(result.current.status).toBe("success");
      expect(result.current.isOffline).toBe(true);
    });

    it('should update status to "error" on failed fetch', async () => {
      mockedGetHomeFeed.mockRejectedValue(new Error("API Error"));

      const { result } = renderHook(() => useHomeStore());

      await act(() => result.current.fetchFeed());

      expect(result.current.status).toBe("error");
      expect(result.current.feedItems).toEqual([]);
    });
  });
});
