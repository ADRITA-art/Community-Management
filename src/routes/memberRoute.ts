import memberController from "../controllers/memberController";
import { authenticate } from "../middlewares/authMiddleware";

export async function memberRoutes(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const subroute = url.pathname.replace("/v1/member", "");

  if (req.method === "POST" && subroute === "") {
    const { userId } = await authenticate(req);
    console.log(`Adding member for user ID: ${userId}`);
    return memberController.addMember(req, userId);
  }

  if (req.method === "DELETE" && /^\/[\w-]+$/.test(subroute)) {
    const { userId } = await authenticate(req);
    const memberId = subroute.slice(1);
    return memberController.removeMember(req, userId, memberId);
  }

  return new Response("Not Found", { status: 404 });
}
