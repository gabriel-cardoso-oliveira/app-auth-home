import {
  createPasswordSchema,
  loginSchema,
} from "@/features/auth/validators/auth.validators";

describe("features/auth/validators/loginSchema", () => {
  it("should validate successfully with a valid email", () => {
    const result = loginSchema.safeParse({
      documentOrEmail: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("should validate successfully with a valid CPF", () => {
    const result = loginSchema.safeParse({
      documentOrEmail: "12345678901",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("should fail if documentOrEmail is empty", () => {
    const result = loginSchema.safeParse({
      documentOrEmail: "",
      password: "password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "O e-mail ou CPF é obrigatório.",
      );
    }
  });

  it("should fail if password is empty", () => {
    const result = loginSchema.safeParse({
      documentOrEmail: "test@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("A senha é obrigatória.");
    }
  });

  it("should fail with an invalid email/CPF format", () => {
    const result = loginSchema.safeParse({
      documentOrEmail: "invalid-format",
      password: "password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Formato de e-mail ou CPF inválido.",
      );
    }
  });
});

describe("features/auth/validators/createPasswordSchema", () => {
  const validData = {
    documentOrEmail: "test@example.com",
    password: "Password123",
    confirmPassword: "Password123",
  };

  it("should validate successfully with valid data", () => {
    const result = createPasswordSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should fail if documentOrEmail is invalid", () => {
    const result = createPasswordSchema.safeParse({
      ...validData,
      documentOrEmail: "invalid",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Formato de e-mail ou CPF inválido.",
      );
    }
  });

  it("should fail if password is too short", () => {
    const result = createPasswordSchema.safeParse({
      ...validData,
      password: "Pass1",
      confirmPassword: "Pass1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "A senha deve ter no mínimo 8 caracteres.",
      );
    }
  });

  it("should fail if password does not contain an uppercase letter", () => {
    const result = createPasswordSchema.safeParse({
      ...validData,
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Deve conter ao menos uma letra maiúscula.",
      );
    }
  });

  it("should fail if password does not contain a lowercase letter", () => {
    const result = createPasswordSchema.safeParse({
      ...validData,
      password: "PASSWORD123",
      confirmPassword: "PASSWORD123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Deve conter ao menos uma letra minúscula.",
      );
    }
  });

  it("should fail if password does not contain a number", () => {
    const result = createPasswordSchema.safeParse({
      ...validData,
      password: "Password",
      confirmPassword: "Password",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Deve conter ao menos um número.",
      );
    }
  });

  it("should fail if passwords do not match", () => {
    const result = createPasswordSchema.safeParse({
      ...validData,
      confirmPassword: "DifferentPassword123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const refinementIssue = result.error.issues.find((issue) =>
        issue.path.includes("confirmPassword"),
      );
      expect(refinementIssue?.message).toBe("As senhas não coincidem.");
    }
  });
});
