import { signupUser, signinUser } from "../services/authService";
import { sendJSON } from "../utils/response";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function signupController(req: Request) {
  try {
    const result = await signupUser(req);
    return sendJSON(200, true, result);
  } catch (err: any) {
    return sendJSON(400, false, err.message);
  }
}

export async function signinController(req: Request) {
  try {
    const result = await signinUser(req);
    return sendJSON(200, true, result);
  } catch (err: any) {
    return sendJSON(400, false, err.message);
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
      },
    });

    if (!user) {
      return {
        status: false,
        message: "User not found",
      };
    }

    return {
      status: true,
      content: {
        data: user,
      },
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.message || "Something went wrong",
    };
  }
}