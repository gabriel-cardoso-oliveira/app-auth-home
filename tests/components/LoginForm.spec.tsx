import { router } from "expo-router";

import { useAuthStore, User } from "@/features/auth/store/auth.store";
import { LoginForm } from "@/features/auth/ui/LoginForm";

import * as authService from "../../src/features/auth/services/auth.service";
import { fireEvent, render, screen, waitFor } from "../test-utils";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));
jest.mock("@/features/auth/services/auth.service");

const mockedAuthService = authService as jest.Mocked<typeof authService>;
const mockedRouter = router as jest.Mocked<typeof router>;

const mockUser: User = { name: "Gabriel", email: "gabriel.pereira@test.com" };
const mockToken = "fake-jwt-token";

describe("features/auth/ui/LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  });

  it("should render the form correctly", () => {
    render(<LoginForm />);

    expect(screen.getByText("Acessar Conta")).toBeVisible();
    expect(screen.getByPlaceholderText("CPF ou E-mail")).toBeVisible();
    expect(screen.getByPlaceholderText("Senha")).toBeVisible();
    expect(screen.getByText("Entrar")).toBeVisible();
    expect(screen.getByText("Criar senha")).toBeVisible();
  });

  it("should display validation errors for empty fields", async () => {
    render(<LoginForm />);

    const loginButton = screen.getByText("Entrar");
    fireEvent.press(loginButton);

    expect(
      await screen.findByText("O e-mail ou CPF é obrigatório."),
    ).toBeVisible();
    expect(await screen.findByText("A senha é obrigatória.")).toBeVisible();

    expect(mockedAuthService.login).not.toHaveBeenCalled();
  });

  it("should handle successful login", async () => {
    mockedAuthService.login.mockResolvedValue({
      user: mockUser,
      accessToken: mockToken,
    });

    render(<LoginForm />);

    fireEvent.changeText(
      screen.getByPlaceholderText("CPF ou E-mail"),
      "gabriel.pereira@test.com",
    );
    fireEvent.changeText(screen.getByPlaceholderText("Senha"), "Password123");

    const loginButton = screen.getByTestId("login-button-submit");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(screen.getByText("Entrar")).toBeVisible();
    });

    await waitFor(() => {
      expect(mockedAuthService.login).toHaveBeenCalledWith({
        documentOrEmail: "gabriel.pereira@test.com",
        password: "Password123",
      });
      expect(mockedRouter.replace).toHaveBeenCalledWith("/home");
    });

    const { user, accessToken, isAuthenticated } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(accessToken).toBe(mockToken);
    expect(isAuthenticated).toBe(true);
  });

  it("should display server error on failed login", async () => {
    const errorMessage = "Credenciais inválidas.";
    mockedAuthService.login.mockRejectedValue(new Error(errorMessage));

    render(<LoginForm />);

    fireEvent.changeText(
      screen.getByPlaceholderText("CPF ou E-mail"),
      "gabriel@email.com",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Senha"),
      "gabrielpassword",
    );
    fireEvent.press(screen.getByText("Entrar"));

    expect(await screen.findByText(errorMessage)).toBeVisible();

    expect(mockedRouter.replace).not.toHaveBeenCalled();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("should navigate to create-password screen on button press", () => {
    render(<LoginForm />);

    const createPasswordButton = screen.getByText("Criar senha");
    fireEvent.press(createPasswordButton);

    expect(mockedRouter.push).toHaveBeenCalledWith("/create-password");
  });
});
