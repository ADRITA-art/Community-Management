// src/utils/prismaMock.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

export const prismaMock = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};
