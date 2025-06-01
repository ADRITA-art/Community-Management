import { authenticate } from "../middlewares/authMiddleware";
import { communityController } from "../controllers/communityController";

export async function communityRoutes(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const subroute = url.pathname.replace("/v1/community", "");
  const method = req.method;

  try {
    // Authenticated routes
    if (subroute === "/me/member" && method === "GET") {
      const { userId } = await authenticate(req);
      return await communityController.getMyJoinedCommunities(req, userId);
    }

    if (subroute === "/me/owner" && method === "GET") {
      const { userId } = await authenticate(req);
      return await communityController.getMyOwnedCommunities(req,userId);
    }

    if (subroute === "" && method === "POST") {
      const { userId } = await authenticate(req);
      return await communityController.createCommunity(req, userId);
    }

    if (subroute === "" && method === "GET") {
      return await communityController.getAllCommunities(req);
    }

    // Get Community Members route
    const memberMatch = url.pathname.match(/^\/v1\/community\/(.+)\/members$/);
    if (memberMatch && method === "GET") {
      const communityId = String(memberMatch[1]);  // Extract communityId from URL
      console.log(`Fetching members for community ID: ${communityId}`);
      return await communityController.getCommunityMembers(req,communityId);  // Pass the req and communityId to controller
    }

    return new Response("Not Found", { status: 404 });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ status: false, error: err.message }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
}
