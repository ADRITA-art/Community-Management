import { PrismaClient } from "@prisma/client"; 
const prisma = new PrismaClient(); 
import { hashPassword, verifyPassword } from "../../validators/v1/hash";
import { createJWT } from "../../validators/v1/jwt";
import {generateId} from "../../utils/v1/id"; 
import { signupSchema } from "../../validators/v1/authValidate";

export async function signupUser(req: Request) {
  const body = await req.json() as { name: string; email: string; password: string };

  const { error, value } = signupSchema.validate(body);
  if (error) throw new Error(error.message);

  const { name, email, password } = value;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("User already exists!!!");

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      id: generateId(), 
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
