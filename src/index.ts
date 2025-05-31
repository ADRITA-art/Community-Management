import { roleRoutes } from "./routes/roleRoute";
import { authRoutes } from "./routes/authRoute";
 console.log(`Server is running on http://localhost:3000`);
Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    if (pathname === "/v1/role") {
     console.log(`Received request for ${pathname} with method ${req.method}`);
      return roleRoutes(req);
    }
if (pathname.startsWith("/v1/auth")) {
      console.log(`Received request for ${pathname} with method ${req.method}`);
      return authRoutes(req);
    }
   
    return new Response("Route Not Found", { status: 404 });
  },
});
