const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables.");
}

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export const config = {
  JWT_SECRET,
  DATABASE_URL,
  PORT,
};
