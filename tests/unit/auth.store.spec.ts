import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook } from "@testing-library/react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { useAuthStore, User } from "@/features/auth/store/auth.store";

jest.mock("expo-secure-store");
jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));

const mockedSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;
const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedRouter = router as jest.Mocked<typeof router>;

const mockUser: User = { name: "Gabriel", email: "gabriel.pereira@test.com" };
const mockToken = "fake-access-token";

describe("features/auth/store/auth.store", () => {
  const initialState = useAuthStore.getState();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState(initialState);
  });

  it("should have the correct initial state", () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("should set user correctly", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it("should set token and update isAuthenticated", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setToken(mockToken);
    });

    expect(result.current.accessToken).toBe(mockToken);
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.setToken(null);
    });

    expect(result.current.accessToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should handle login correctly", async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login(mockUser, mockToken);
    });

    expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith(
      "accessToken",
      mockToken,
    );
    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      "userProfile",
      JSON.stringify(mockUser),
    );

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.accessToken).toBe(mockToken);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle logout correctly", async () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser(mockUser);
      result.current.setToken(mockToken);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalledWith(
      "accessToken",
    );
    expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith("userProfile");
    expect(mockedRouter.replace).toHaveBeenCalledWith("/login");

    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  describe("restoreSession", () => {
    it("should restore session if token and user profile exist", async () => {
      mockedSecureStore.getItemAsync.mockResolvedValue(mockToken);
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuthStore());

      let sessionRestored: boolean | undefined;
      await act(async () => {
        sessionRestored = await result.current.restoreSession();
      });

      expect(sessionRestored).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.accessToken).toBe(mockToken);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it("should not restore session if token is missing", async () => {
      mockedSecureStore.getItemAsync.mockResolvedValue(null);
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuthStore());

      let sessionRestored: boolean | undefined;
      await act(async () => {
        sessionRestored = await result.current.restoreSession();
      });

      expect(sessionRestored).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.accessToken).toBeNull();
    });
  });
});
