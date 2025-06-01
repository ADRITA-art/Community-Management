import { PrismaClient } from "@prisma/client"; // import PrismaClient class
const prisma = new PrismaClient(); // instantiate PrismaClient
import { generateSlug } from "../utils/slug";
import { generateId } from "../utils/id"; // Adjust the import path as necessary



export const createCommunity = async (userId: string, data: { name: string }) => {
  const slug = generateSlug(data.name); // Generate slug based on community name
  return await prisma.$transaction(async (tx) => {
    const communityAdminRole = await tx.role.findFirst({ where: { name: 'Community Admin' } });
    if (!communityAdminRole) {
      throw new Error('Community Admin role not found');
    }
    const community = await tx.community.create({
      data: {
        id: generateId(),
        name: data.name,
        slug,
        ownerId: userId,
      },
    });

    await tx.member.create({
      data: {
        id: generateId(),
        communityId: community.id,
        userId: userId,
        roleId: communityAdminRole.id, 
      },
    });

    return community;
  });
};


export const getAllCommunities = async (req: any) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const total = await prisma.community.count();
  const communities = await prisma.community.findMany({
    skip,
    take: limit,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
        },
}
    }
  });

 return {
      meta: {
      total,
      pages: Math.ceil(total / limit),
      page,
    },
    data: communities.map((community) => ({
      id: community.id,
      name: community.name,
      slug: community.slug,
      owner: {
        id: community.owner.id,
        name: community.owner.name,
      },
      created_at: community.created_at.toISOString(),
      updated_at: community.updated_at.toISOString(),
    })),
   
  };
};

export const getCommunityMembers = async (communityId: string, page: number) => {
  const limit = 10;
  const skip = (page - 1) * limit;

  const community = await prisma.community.findUnique({ where: { slug: communityId } });
  if (!community) {
    throw new Error('Community not found');
  }

  const total = await prisma.member.count({ where: { communityId: community.id } });
  const members = await prisma.member.findMany({
    where: { communityId: community.id },
    skip,
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    meta: {
      total,
      pages: Math.ceil(total / limit),
      page,
    },
    data: members,
  };
};

export const getMyOwnedCommunities = async (userId: string, page: number) => {
  const limit = 10;
  const skip = (page - 1) * limit;

  const total = await prisma.community.count({
    where: { ownerId: userId },
  });

  const communities = await prisma.community.findMany({
    where: { ownerId: userId },
    skip,
    take: limit,
  });

  return {
    meta: {
      total,
      pages: Math.ceil(total / limit),
      page,
    },
    data: communities,
  };
};

export const getMyJoinedCommunities = async (userId: string, page: number) => {
  const limit = 10;
  const skip = (page - 1) * limit;

  const memberships = await prisma.member.findMany({
    where: { userId },
    skip,
    take: limit,
    include: {
      community: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  const total = await prisma.member.count({ where: { userId } });

  const data = memberships.map((m) => m.community);

  return {
    data,
    meta: {
      total,
      pages: Math.ceil(total / limit),
      page,
    },
  };
};
