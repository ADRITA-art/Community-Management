import { verify } from "jsonwebtoken";

const rawSecret = process.env.JWT_SECRET;

if (!rawSecret) {
  throw new Error("JWT_SECRET is not defined in environment.");
}

const SECRET: string = rawSecret;

export async function authenticate(req: Request): Promise<{ userId: string }> {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new Error("Unauthorized: Token is missing or malformed");
  }

  try {
console.log("Token received:", token);

    const payload = verify(token, SECRET);

    if (
      typeof payload === "object" &&
      payload !== null &&
      "id" in payload &&
      typeof (payload as any).id === "string"
    ) {
      return { userId: (payload as any).id };
    }

    throw new Error("Unauthorized: Invalid token payload");
  } catch (err) {
    throw new Error("Unauthorized: Invalid token");
  }
}
