import { FeedItem, useHomeStore } from "@/features/home/store/home.store";
import { HomeFeed } from "@/features/home/ui/HomeFeed";

import { render, screen } from "../test-utils";

jest.mock("@/features/home/store/home.store");

const mockedUseHomeStore = useHomeStore as jest.Mock;

const mockFeedItems: FeedItem[] = [
  {
    id: "1",
    title: "Primeiro Item",
    subtitle: "Sub 1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Segundo Item",
    subtitle: "Sub 2",
    createdAt: new Date().toISOString(),
  },
];

describe("features/home/ui/HomeFeed", () => {
  const mockFetchFeed = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseHomeStore.mockReturnValue({
      feedItems: [],
      status: "idle",
      isOffline: false,
      fetchFeed: mockFetchFeed,
    });
  });

  it("should call fetchFeed on mount", () => {
    render(<HomeFeed />);
    expect(mockFetchFeed).toHaveBeenCalledTimes(1);
  });

  it('should render the skeleton when status is "loading"', () => {
    mockedUseHomeStore.mockReturnValue({
      status: "loading",
      fetchFeed: mockFetchFeed,
    });

    render(<HomeFeed />);

    expect(screen.getByTestId("feed-skeleton")).toBeVisible();
  });

  it('should render an error message when status is "error"', () => {
    mockedUseHomeStore.mockReturnValue({
      status: "error",
      fetchFeed: mockFetchFeed,
    });

    render(<HomeFeed />);

    expect(
      screen.getByText("Ocorreu um erro ao carregar o feed."),
    ).toBeVisible();
  });

  it("should render the feed items on successful fetch", () => {
    mockedUseHomeStore.mockReturnValue({
      feedItems: mockFeedItems,
      status: "success",
      isOffline: false,
      fetchFeed: mockFetchFeed,
    });

    render(<HomeFeed />);

    expect(screen.getByText("Primeiro Item")).toBeVisible();
    expect(screen.getByText("Segundo Item")).toBeVisible();

    expect(screen.queryByTestId("offline-banner")).toBeNull();
  });

  it("should render the offline banner when isOffline is true", () => {
    mockedUseHomeStore.mockReturnValue({
      feedItems: mockFeedItems,
      status: "success",
      isOffline: true,
      fetchFeed: mockFetchFeed,
    });

    render(<HomeFeed />);

    expect(screen.getByTestId("offline-banner")).toBeVisible();

    expect(screen.getByText("Primeiro Item")).toBeVisible();
  });
});
