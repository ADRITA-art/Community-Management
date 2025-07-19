import { PrismaClient } from "@prisma/client";
import { generateId } from "@utils/v1/id";
const prisma = new PrismaClient();

export const createRole = async (name: string) => {
  return await prisma.role.create({
    data: { id: generateId(), name, scopes: [] },
  });
};

export const getAllRoles = async () => {
  return await prisma.role.findMany();
};

