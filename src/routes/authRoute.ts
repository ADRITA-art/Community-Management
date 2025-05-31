import { signupController, signinController, getUserById } from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";

export async function authRoutes(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const subroute = url.pathname.replace("/v1/auth", "");
  

  if (req.method === "POST" && subroute === "/signup") {
    return signupController(req);
  }

  if (req.method === "POST" && subroute === "/signin") {
    return signinController(req);
  }
  if (req.method === "GET" && subroute === "/me") {
    const { userId } = await authenticate(req);
    const result = await getUserById(userId);
    return new Response(JSON.stringify(result),{
status: 200, headers: { "Content-Type": "application/json" } });
  }
  
  return new Response("Not Found", { status: 404 });
}
