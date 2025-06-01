import * as communityService from '../services/communityService';
import { createCommunitySchema } from "../validators/communityValidate";

const communityController = {
  async createCommunity(req: Request, userId: string): Promise<Response> {
    try {
      const body = await req.json();
      const { error, value } = createCommunitySchema.validate(body);
      if (error) {
        return new Response(
          JSON.stringify({ status: false, error: error.message }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const result = await communityService.createCommunity(userId, value);
      return new Response(
        JSON.stringify({ status: true, content: { data: result } }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({ status: false, error: err.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  },

  async getAllCommunities(req: Request): Promise<Response> {
    try {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get("page")) || 1;
      const result = await communityService.getAllCommunities({ query: { page } });
      return new Response(
        JSON.stringify({ status: true, content: result }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({ status: false, error: err.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  },

  async getCommunityMembers(req: Request, communityId: string): Promise<Response> {
    try {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get("page")) || 1;
      const result = await communityService.getCommunityMembers(communityId, page);
      return new Response(
        JSON.stringify({ status: true, content: result }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({ status: false, error: err.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  },

  async getMyOwnedCommunities(req: Request, userId: string): Promise<Response> {
    try {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get("page")) || 1;
      const result = await communityService.getMyOwnedCommunities(userId, page);
      return new Response(
        JSON.stringify({ status: true, content: result }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({ status: false, error: err.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  },

  async getMyJoinedCommunities(req: Request, userId: string): Promise<Response> {
    try {
      const url = new URL(req.url);
      const page = Number(url.searchParams.get("page")) || 1;
      const result = await communityService.getMyJoinedCommunities(userId, page);
      return new Response(
        JSON.stringify({ status: true, content: result }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({ status: false, error: err.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }
};

export { communityController };
