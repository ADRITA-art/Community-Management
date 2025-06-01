import { PrismaClient } from "@prisma/client"; // import PrismaClient class
const prisma = new PrismaClient(); // instantiate PrismaClient
import { hashPassword, verifyPassword } from "../validators/hash";
import { createJWT } from "../validators/jwt";
import {generateId} from "../utils/id"; // Adjust the import path as necessary
import { signupSchema } from "../validators/authValidate";

export async function signupUser(req: Request) {
  const body = await req.json() as { name: string; email: string; password: string };

  // Validate request body
  const { error, value } = signupSchema.validate(body);
  if (error) throw new Error(error.message);

  const { name, email, password } = value;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("User already exists");

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      id: generateId(), // Generate a unique ID for the user
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = createJWT({ id: user.id });

  return {
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    },
    meta: { access_token: token },
  };
}

export async function signinUser(req: Request) {
    const body = await req.json() as {email: string; password: string };
   const { email, password } = body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const valid = await verifyPassword(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = createJWT({ id: user.id });

  return {
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    },
    meta: { access_token: token },
  };
}
