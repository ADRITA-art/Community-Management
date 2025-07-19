
import { vi } from "vitest";
import { test, expect, describe, beforeEach } from "bun:test";
import { signupUser, signinUser } from "../services/v1/authService";
import { PrismaClient } from "@prisma/client";

const mockFindUnique = vi.fn();
const mockCreate = vi.fn();
const mockVerifyPassword = vi.fn();
const mockHashPassword = vi.fn(() => "hashedPassword");
const mockCreateJWT = vi.fn(() => "test-token");

vi.mock("@prisma/client", () => {
  return {
    PrismaClient: vi.fn().mockImplementation(() => ({
      user: {
        findUnique: mockFindUnique,
        create: mockCreate,
      },
    })),
  };
});

vi.mock("../validators/hash", () => ({
  hashPassword: mockHashPassword,
  verifyPassword: mockVerifyPassword,
}));

vi.mock("../validators/jwt", () => ({
  createJWT: mockCreateJWT,
}));

vi.mock("../utils/id", () => ({
  generateId: () => "test-id",
}));

vi.mock("../validators/authValidate", () => ({
  signupSchema: {
    validate: () => ({
      value: {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      },
    }),
  },
}));

describe("authService", () => {
  let prisma: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    mockFindUnique.mockReset();
    mockCreate.mockReset();
    mockVerifyPassword.mockReset();
    mockHashPassword.mockClear();
    mockCreateJWT.mockClear();
  });

  test("signupUser - should create a new user and return user data with token", async () => {
    const req = {
      json: async () => ({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      }),
    };

    mockFindUnique.mockResolvedValue(null);

    const mockUser = {
      id: "test-id",
      name: "Test User",
      email: "test@example.com",
      password: "hashedPassword",
      created_at: new Date(),
    };
    mockCreate.mockResolvedValue(mockUser);

    const result = await signupUser(req as any);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(mockHashPassword).toHaveBeenCalledWith("password123");
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        id: "test-id",
        name: "Test User",
        email: "test@example.com",
        password: "hashedPassword",
      },
    });
    expect(mockCreateJWT).toHaveBeenCalledWith({ id: "test-id" });
    expect(result).toEqual({
      data: {
        id: "test-id",
        name: "Test User",
        email: "test@example.com",
        created_at: mockUser.created_at,
      },
      meta: { access_token: "test-token" },
    });
  });

  test("signupUser - should throw if user already exists", async () => {
    const req = {
      json: async () => ({
        name: "Test User",
        email: "existing@example.com",
        password: "password123",
      }),
    };

    mockFindUnique.mockResolvedValue({ id: "existing-id" });

    await expect(signupUser(req as any)).rejects.toThrow("User already exists");
  });

  test("signinUser - should authenticate and return token", async () => {
    const req = {
      json: async () => ({
        email: "test@example.com",
        password: "password123",
      }),
    };

    const mockUser = {
      id: "test-id",
      name: "Test User",
      email: "test@example.com",
      password: "hashedPassword",
      created_at: new Date(),
    };

    mockFindUnique.mockResolvedValue(mockUser);
    mockVerifyPassword.mockResolvedValue(true);

    const result = await signinUser(req as any);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(mockVerifyPassword).toHaveBeenCalledWith(
      "password123",
      "hashedPassword"
    );
    expect(result).toEqual({
      data: {
        id: "test-id",
        name: "Test User",
        email: "test@example.com",
        created_at: mockUser.created_at,
      },
      meta: { access_token: "test-token" },
    });
  });

  test("signinUser - should throw if user not found", async () => {
    const req = {
      json: async () => ({
        email: "nonexistent@example.com",
        password: "password123",
      }),
    };

    mockFindUnique.mockResolvedValue(null);

    await expect(signinUser(req as any)).rejects.toThrow("User not found");
  });

  test("signinUser - should throw if password is invalid", async () => {
    const req = {
      json: async () => ({
        email: "test@example.com",
        password: "wrongpassword",
      }),
    };

    mockFindUnique.mockResolvedValue({
      id: "test-id",
      password: "hashedPassword",
    });
    mockVerifyPassword.mockResolvedValue(false);

    await expect(signinUser(req as any)).rejects.toThrow("Invalid credentials");
  });
});
