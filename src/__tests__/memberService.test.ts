import { PrismaClient } from '@prisma/client';
import { addMember, removeMember } from '../services/v1/memberService';

// Mock dependencies
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    role: {
      findUnique: jest.fn(),
      findFirst: jest.fn()
    },
    member: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn()
    }
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

jest.mock('../utils/id', () => ({
  generateId: jest.fn(() => 'test-member-id')
}));

describe('memberService', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('addMember', () => {
    const adminRoleMock = { id: 'admin-role-id', name: 'Community Admin' };
    const memberData = {
      community: 'community-id',
      user: 'user-id',
      role: 'member-role-id'
    };

    it('should add a member when requester is an admin', async () => {
      // Mock admin role exists
      prisma.role.findUnique.mockResolvedValue(adminRoleMock);
      
      // Mock requester is an admin
      prisma.member.findFirst.mockResolvedValueOnce({
        id: 'requester-member-id',
        communityId: 'community-id',
        userId: 'requester-id',
        roleId: 'admin-role-id'
      });
      
      // Mock user is not already a member
      prisma.member.findFirst.mockResolvedValueOnce(null);
      
      // Mock successful member creation
      const newMemberMock = {
        id: 'test-member-id',
        communityId: 'community-id',
        userId: 'user-id',
        roleId: 'member-role-id'
      };
      prisma.member.create.mockResolvedValue(newMemberMock);

      const result = await addMember('requester-id', memberData);

      expect(prisma.role.findUnique).toHaveBeenCalledWith({
        where: { name: 'Community Admin' }
      });
      expect(prisma.member.findFirst).toHaveBeenCalledWith({
        where: {
          communityId: 'community-id',
          userId: 'requester-id'
        }
      });
      expect(prisma.member.findFirst).toHaveBeenCalledWith({
        where: {
          communityId: 'community-id',
          userId: 'user-id'
        }
      });
      expect(prisma.member.create).toHaveBeenCalledWith({
        data: {
          id: 'test-member-id',
          communityId: 'community-id',
          userId: 'user-id',
          roleId: 'member-role-id'
        }
      });
      expect(result).toEqual(newMemberMock);
    });

    it('should throw an error if admin role is not found', async () => {
      // Mock admin role doesn't exist
      prisma.role.findUnique.mockResolvedValue(null);

      await expect(addMember('requester-id', memberData)).rejects.toThrow('Admin role not found');
    });

    it('should throw NotAllowedAccess if requester is not an admin', async () => {
      // Mock admin role exists
      prisma.role.findUnique.mockResolvedValue(adminRoleMock);
      
      // Mock requester is not an admin
      prisma.member.findFirst.mockResolvedValueOnce({
        id: 'requester-member-id',
        communityId: 'community-id',
        userId: 'requester-id',
        roleId: 'regular-role-id' // Not an admin role
      });

      await expect(addMember('requester-id', memberData)).rejects.toThrow('NOT_ALLOWED_ACCESS');
      expect(prisma.member.create).not.toHaveBeenCalled();
    });

    it('should throw an error if user is already a member', async () => {
      // Mock admin role exists
      prisma.role.findUnique.mockResolvedValue(adminRoleMock);
      
      // Mock requester is an admin
      prisma.member.findFirst.mockResolvedValueOnce({
        id: 'requester-member-id',
        communityId: 'community-id',
        userId: 'requester-id',
        roleId: 'admin-role-id'
      });
      
      // Mock user is already a member
      prisma.member.findFirst.mockResolvedValueOnce({
        id: 'existing-member-id',
        communityId: 'community-id',
        userId: 'user-id',
        roleId: 'some-role-id'
      });

      await expect(addMember('requester-id', memberData)).rejects.toThrow('User is already a member of this community');
      expect(prisma.member.create).not.toHaveBeenCalled();
    });
  });

  describe('removeMember', () => {
    const adminRoleMock = { id: 'admin-role-id', name: 'Community Admin' };
    const moderatorRoleMock = { id: 'moderator-role-id', name: 'Community Moderator' };
    const membershipMock = {
      id: 'member-id',
      communityId: 'community-id',
      userId: 'user-id',
      roleId: 'member-role-id',
      community: { id: 'community-id', name: 'Test Community' }
    };

    it('should remove a member when requester is an admin', async () => {
      // Mock membership exists
      prisma.member.findUnique.mockResolvedValue(membershipMock);
      
      // Mock requester is an admin
      prisma.member.findFirst.mockResolvedValue({
        id: 'requester-member-id',
        communityId: 'community-id',
        userId: 'requester-id',
        roleId: 'admin-role-id'
      });
      
      // Mock roles exist
      prisma.role.findUnique.mockResolvedValueOnce(adminRoleMock);
      prisma.role.findUnique.mockResolvedValueOnce(moderatorRoleMock);

      await removeMember('requester-id', 'member-id');

      expect(prisma.member.findUnique).toHaveBeenCalledWith({
        where: { id: 'member-id' },
        include: { community: true }
      });
      expect(prisma.member.findFirst).toHaveBeenCalledWith({
        where: {
          communityId: 'community-id',
          userId: 'requester-id'
        }
      });
      expect(prisma.member.delete).toHaveBeenCalledWith({
        where: { id: 'member-id' }
      });
    });

    it('should throw an error if membership is not found', async () => {
      prisma.member.findUnique.mockResolvedValue(null);

      await expect(removeMember('requester-id', 'non-existent-member-id')).rejects.toThrow('MEMBER_NOT_FOUND');
    });

    it('should throw an error if admin and moderator roles are not found', async () => {
      // Mock membership exists
      prisma.member.findUnique.mockResolvedValue(membershipMock);
      
      // Mock requester's membership
      prisma.member.findFirst.mockResolvedValue({
        id: 'requester-member-id',
        communityId: 'community-id',
        userId: 'requester-id',
        roleId: 'some-role-id'
      });
      
      // Mock roles don't exist
      prisma.role.findUnique.mockResolvedValueOnce(null);
      prisma.role.findUnique.mockResolvedValueOnce(null);

      await expect(removeMember('requester-id', 'member-id')).rejects.toThrow('Admin or Moderator role not found');
    });

    it('should throw NotAllowedAccess if requester is not an admin or moderator', async () => {
      // Mock membership exists
      prisma.member.findUnique.mockResolvedValue(membershipMock);
      
      // Mock requester's membership (not admin or moderator)
      prisma.member.findFirst.mockResolvedValue({
        id: 'requester-member-id',
        communityId: 'community-id',
        userId: 'requester-id',
        roleId: 'regular-role-id' // Not admin or moderator role
      });
      
      // Mock roles exist
      prisma.role.findUnique.mockResolvedValueOnce(adminRoleMock);
      prisma.role.findUnique.mockResolvedValueOnce(moderatorRoleMock);

      await expect(removeMember('requester-id', 'member-id')).rejects.toThrow('NOT_ALLOWED_ACCESS');
      expect(prisma.member.delete).not.toHaveBeenCalled();
    });
  });
});
