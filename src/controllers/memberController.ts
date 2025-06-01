import * as memberService from "../services/memberService";

const memberController = {
  async addMember(req: Request, userId: string): Promise<Response> {
    try {
      const body = await req.json();
      console.log(`Adding member for user ID: ${userId}`, body);

      if (
        typeof body !== "object" ||
        body === null ||
        !("community" in body) ||
        !("user" in body) ||
        !("role" in body)
      ) {
        return new Response(
          JSON.stringify({
            status: false,
            error: "Invalid request body. 'community', 'user', and 'role' are required.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const { community, user, role } = body;
      if (
        typeof community !== "string" ||
        typeof user !== "string" ||
        typeof role !== "string"
      ) {
        return new Response(
          JSON.stringify({
            status: false,
            error: "'community', 'user', and 'role' must be strings.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      const result = await memberService.addMember(userId, { community, user, role });
      return new Response(JSON.stringify({ status: true, content: { data: result } }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ status: false, error: err.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  },

  async removeMember(req: Request, userId: string, memberId: string): Promise<Response> {
    try {
      const result = await memberService.removeMember(userId, memberId);
      return new Response(JSON.stringify({ status: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ status: false, error: err.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};

export default memberController;
