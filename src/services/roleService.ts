import { PrismaClient } from "@prisma/client";
import { generateId } from "../utils/id"; // Adjust the import path as necessary
const prisma = new PrismaClient();

export const createRole = async (name: string) => {
  return await prisma.role.create({
    data: { id: generateId(), name, scopes: [] },
  });
};

export const getAllRoles = async () => {
  return await prisma.role.findMany();
};
