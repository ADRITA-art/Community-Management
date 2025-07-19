import { roleRoutes } from "./src/api/v1/roleApi";
import { authRoutes } from "./src/api/v1/authApi";
import { communityRoutes } from "./src/api/v1/communityApi";
import {memberRoutes} from "./src/api/v1/memberApi";
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
    if (pathname.startsWith("/v1/community")) {
      console.log(`Received request for ${pathname} with method ${req.method}`);
      return communityRoutes(req);
    }
   
      if (pathname.startsWith("/v1/member")) {
      console.log(`Received request for ${pathname} with method ${req.method}`);
      return memberRoutes(req);
    }
    return new Response("Route Not Found", { status: 404 });
  },
});
