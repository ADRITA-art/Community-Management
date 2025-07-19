import { sign } from "jsonwebtoken";
import { config } from "../../config/constant";

const JWT_SECRET = config.JWT_SECRET;

export function createJWT(payload: object): string {
  return sign(payload, JWT_SECRET, {
    expiresIn: "1d",
    issuer: new Date().toISOString(),
  });
}
