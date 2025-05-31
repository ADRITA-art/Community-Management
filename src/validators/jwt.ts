import { sign } from "jsonwebtoken";

const rawSecret = process.env.JWT_SECRET;

if (!rawSecret) {
  throw new Error("JWT_SECRET is not defined in environment.");
}

const JWT_SECRET: string = rawSecret;

export function createJWT(payload: object): string {
  return sign(payload, JWT_SECRET, {
    expiresIn: "1d",
    issuer: new Date().toISOString(),
  });
}
