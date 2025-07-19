import { PrismaClient } from "@prisma/client";
import ora from "ora";

const prisma = new PrismaClient();

export async function connectToDatabase() {
  const spinner = ora("Connecting to database...").start();
  try {
    await prisma.$connect();
    spinner.succeed("Database connected!");
    return prisma;
  } catch (error) {
    spinner.fail("Failed to connect to database.");
    console.error(error);
    process.exit(1);
  }
}

export { prisma }; 