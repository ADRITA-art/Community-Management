import { handleCreateRole, handleGetAllRoles } from "../controllers/roleController";
import { authenticate } from "../middlewares/authMiddleware";

export const roleRoutes = async (req: Request): Promise<Response> => {
  const { method, url } = req;
  console.log(`Received request for ${url} with method ${method}`);

  if (method === "POST") {
    const body = await req.json();
    const result = await handleCreateRole({ body } as any);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  if ( method === "GET") {
    const result = await handleGetAllRoles();
    console.log(`Returning roles: ${JSON.stringify(result)}`);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("Not Found", { status: 404 });
};
