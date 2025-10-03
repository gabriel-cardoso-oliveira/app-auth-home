import { router } from "expo-router";

import { useAuthStore, User } from "@/features/auth/store/auth.store";
import { CreatePasswordForm } from "@/features/auth/ui/CreatePasswordForm";

import * as authService from "../../src/features/auth/services/auth.service";
import { fireEvent, render, screen, waitFor } from "../test-utils";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
}));
jest.mock("@/features/auth/services/auth.service");
jest.mock("@/shared/components/PasswordStrengthIndicator", () => ({
  PasswordStrengthIndicator: () => null,
}));

const mockedAuthService = authService as jest.Mocked<typeof authService>;
const mockedRouter = router as jest.Mocked<typeof router>;

const mockUser: User = { name: "John Doe", email: "gabriel.pereira@test.com" };
const mockToken = "fake-jwt-token";

describe("features/auth/ui/CreatePasswordForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  });

  it("should render the form correctly", () => {
    render(<CreatePasswordForm />);

    expect(screen.getByText("Criar Senha")).toBeVisible();
    expect(screen.getByPlaceholderText("CPF ou E-mail")).toBeVisible();
    expect(screen.getByPlaceholderText("Senha")).toBeVisible();
    expect(screen.getByPlaceholderText("Confirmar Senha")).toBeVisible();
    expect(screen.getByText("Criar e Acessar")).toBeVisible();
    expect(screen.getByText("Voltar")).toBeVisible();
  });

  it("should display validation errors for invalid data", async () => {
    render(<CreatePasswordForm />);

    fireEvent.press(screen.getByText("Criar e Acessar"));

    expect(
      await screen.findByText("O e-mail ou CPF é obrigatório."),
    ).toBeVisible();
    expect(await screen.findByText("A senha é obrigatória.")).toBeVisible();

    fireEvent.changeText(
      screen.getByPlaceholderText("CPF ou E-mail"),
      "gabriel.pereira@test.com",
    );
    fireEvent.changeText(screen.getByPlaceholderText("Senha"), "Password123");
    fireEvent.changeText(
      screen.getByPlaceholderText("Confirmar Senha"),
      "Different123",
    );

    fireEvent.press(screen.getByText("Criar e Acessar"));

    expect(await screen.findByText("As senhas não coincidem.")).toBeVisible();
    expect(mockedAuthService.createPassword).not.toHaveBeenCalled();
  });

  it("should handle successful password creation and login", async () => {
    mockedAuthService.createPassword.mockResolvedValue({
      user: mockUser,
      accessToken: mockToken,
    });

    render(<CreatePasswordForm />);

    fireEvent.changeText(
      screen.getByPlaceholderText("CPF ou E-mail"),
      "gabriel.pereira@test.com",
    );
    fireEvent.changeText(screen.getByPlaceholderText("Senha"), "Password123");
    fireEvent.changeText(
      screen.getByPlaceholderText("Confirmar Senha"),
      "Password123",
    );

    const submitButton = screen.getByText("Criar e Acessar");
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockedAuthService.createPassword).toHaveBeenCalledWith({
        documentOrEmail: "gabriel.pereira@test.com",
        password: "Password123",
        confirmPassword: "Password123",
      });
      expect(mockedRouter.replace).toHaveBeenCalledWith("/home");
    });

    const { user, accessToken, isAuthenticated } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(accessToken).toBe(mockToken);
    expect(isAuthenticated).toBe(true);
  });

  it("should display server error on failed password creation", async () => {
    const errorMessage = "Este usuário já possui uma senha.";
    mockedAuthService.createPassword.mockRejectedValue(new Error(errorMessage));

    render(<CreatePasswordForm />);

    fireEvent.changeText(
      screen.getByPlaceholderText("CPF ou E-mail"),
      "gabriel.pereira@test.com",
    );
    fireEvent.changeText(screen.getByPlaceholderText("Senha"), "Password123");
    fireEvent.changeText(
      screen.getByPlaceholderText("Confirmar Senha"),
      "Password123",
    );

    fireEvent.press(screen.getByText("Criar e Acessar"));

    expect(await screen.findByText(errorMessage)).toBeVisible();

    expect(mockedRouter.replace).not.toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('should navigate back when "Voltar" button is pressed', () => {
    render(<CreatePasswordForm />);

    const backButton = screen.getByText("Voltar");
    fireEvent.press(backButton);

    expect(mockedRouter.back).toHaveBeenCalledTimes(1);
  });
});
