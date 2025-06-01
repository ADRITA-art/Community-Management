import { PrismaClient } from "@prisma/client";
import { generateId } from "../utils/id"; // Adjust the import path as necessary
const prisma = new PrismaClient();


class NotAllowedAccess extends Error {
  statusCode: number;
  constructor() {
    super('NOT_ALLOWED_ACCESS');
    this.statusCode = 403;
  }
}

export const addMember = async (
  requesterId: string,
  data: { community: string; user: string; role: string }
) => {
  // Find the Community Admin role
  console.log('Adding member ', data.user, 'by requester:', requesterId);
  const adminRole = await prisma.role.findUnique({
    where: { name: 'Community Admin' },
  });

  if (!adminRole) {
    throw new Error('Admin role not found');
  }

  // Check if requester is an admin in the community
  const requesterMembership = await prisma.member.findFirst({
    where: {
      communityId: data.community,
      userId: requesterId,
    },
  });

  if (!requesterMembership || requesterMembership.roleId !== adminRole.id) {
    throw new NotAllowedAccess(); // You can replace with a standard 403 error if preferred
  }

  // Ensure the user isn’t already a member
  const existingMembership = await prisma.member.findFirst({
    where: {
      communityId: data.community,
      userId: data.user,
    },
  });

  if (existingMembership) {
    throw new Error('User is already a member of this community');
  }

  // Add the user as a member to the community with the specified role
  const newMember = await prisma.member.create({
    data: {
      id: generateId(),
      communityId: data.community,
      userId: data.user,
      roleId: data.role,
    },
  });

  return newMember;
};


export const removeMember = async (requesterId: string, membershipId: string) => {
  const membership = await prisma.member.findUnique({
    where: { id: membershipId },
    include: {
      community: true,
    },
  });

  if (!membership) throw new Error('MEMBER_NOT_FOUND');

  const requesterMembership = await prisma.member.findFirst({
    where: {
      communityId: membership.communityId,
      userId: requesterId,
    },
  });
  const adminRole = await prisma.role.findUnique({
    where: { name: 'Community Admin' },
  });
  const moderatorRole = await prisma.role.findUnique({
    where: { name: 'Community Moderator' },
  });

  if (!adminRole && !moderatorRole) {
    throw new Error('Admin or Moderator role not found');
  }

  
  if (!requesterMembership || (requesterMembership.roleId !== adminRole?.id && requesterMembership.roleId !== moderatorRole?.id)) {
    throw new NotAllowedAccess();
  }

  await prisma.member.delete({
    where: { id: membershipId },
  });

  return membership;
};
