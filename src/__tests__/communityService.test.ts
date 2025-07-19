import { PrismaClient } from '@prisma/client';
import { 
  createCommunity, 
  getAllCommunities, 
  getCommunityMembers,
  getMyOwnedCommunities,
  getMyJoinedCommunities
} from '../services/v1/communityService';

jest.mock('@prisma/client', () => {
  const mockTransaction = jest.fn(callback => callback({ 
    role: { findFirst: jest.fn() },
    community: { create: jest.fn() },
    member: { create: jest.fn() }
  }));
  
  const mockPrismaClient = {
    $transaction: mockTransaction,
    community: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn()
    },
    member: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn()
    },
    role: {
      findFirst: jest.fn()
    } 
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

jest.mock('../utils/slug', () => ({
  generateSlug: jest.fn(name => `${name.toLowerCase().replace(/\s+/g, '-')}`)
}));

jest.mock('../utils/id', () => ({
  generateId: jest.fn(() => 'test-id')
}));

describe('communityService', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('createCommunity', () => {
    it('should create a new community and add creator as admin', async () => {
      const userId = 'user-id';
      const communityData = { name: 'Test Community' };
      
      const adminRoleMock = { id: 'admin-role-id', name: 'Community Admin' };
      const tx = {
        role: { findFirst: jest.fn().mockResolvedValue(adminRoleMock) },
        community: { create: jest.fn() },
        member: { create: jest.fn() }
      };
      
      const communityMock = {
        id: 'test-id',
        name: 'Test Community',
        slug: 'test-community',
        ownerId: userId
      };
      tx.community.create.mockResolvedValue(communityMock);
      
    prisma.$transaction.mockImplementation((callback: (tx: typeof prisma) => any) => callback(tx));


      const result = await createCommunity(userId, communityData);

      expect(tx.role.findFirst).toHaveBeenCalledWith({ where: { name: 'Community Admin' } });
      expect(tx.community.create).toHaveBeenCalledWith({
        data: {
          id: 'test-id',
          name: 'Test Community',
          slug: 'test-community',
          ownerId: userId
        }
      });
      expect(tx.member.create).toHaveBeenCalledWith({
        data: {
          id: 'test-id',
          communityId: 'test-id',
          userId: userId,
          roleId: 'admin-role-id'
        }
      });
      expect(result).toEqual(communityMock);
    });

    it('should throw an error if admin role is not found', async () => {
      const userId = 'user-id';
      const communityData = { name: 'Test Community' };
      
      // Mock role not found
      const tx = {
        role: { findFirst: jest.fn().mockResolvedValue(null) },
        community: { create: jest.fn() },
        member: { create: jest.fn() }
      };
      
      prisma.$transaction.mockImplementation((callback: (tx: typeof prisma) => any) => callback(tx));


      await expect(createCommunity(userId, communityData)).rejects.toThrow('Community Admin role not found');
      expect(tx.community.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllCommunities', () => {
    it('should return paginated communities', async () => {
      const req = { query: { page: '2' } };
      const communityMocks = [
        {
          id: 'community-1',
          name: 'Community 1',
          slug: 'community-1',
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
          owner: { id: 'owner-1', name: 'Owner 1' }
        },
        {
          id: 'community-2',
          name: 'Community 2',
          slug: 'community-2',
          created_at: new Date('2023-01-02'),
          updated_at: new Date('2023-01-02'),
          owner: { id: 'owner-2', name: 'Owner 2' }
        }
      ];
      
      prisma.community.count.mockResolvedValue(25); 
      prisma.community.findMany.mockResolvedValue(communityMocks);

      const result = await getAllCommunities(req);

      expect(prisma.community.count).toHaveBeenCalled();
      expect(prisma.community.findMany).toHaveBeenCalledWith({
        skip: 10, 
        take: 10,
        include: {
          owner: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      expect(result).toEqual({
        meta: {
          total: 25,
          pages: 3,
          page: 2
        },
        data: communityMocks.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          owner: {
            id: c.owner.id,
            name: c.owner.name
          },
          created_at: c.created_at.toISOString(),
          updated_at: c.updated_at.toISOString()
        }))
      });
    });

    it('should use default page 1 if not specified', async () => {
      const req = { query: {} };
      
      prisma.community.count.mockResolvedValue(5);
      prisma.community.findMany.mockResolvedValue([]);

      await getAllCommunities(req);

      expect(prisma.community.findMany).toHaveBeenCalledWith({
        skip: 0, // (page 1 - 1) * 10
        take: 10,
        include: expect.any(Object)
      });
    });
  });

  describe('getCommunityMembers', () => {
    it('should return paginated community members', async () => {
      const communityId = 'community-slug';
      const page = 1;
      
      // Mock community exists
      const communityMock = { id: 'community-id', slug: 'community-slug' };
      prisma.community.findUnique.mockResolvedValue(communityMock);
      
      // Mock members
      const memberMocks = [
        {
          id: 'member-1',
          communityId: 'community-id',
          userId: 'user-1',
          roleId: 'role-1',
          user: { id: 'user-1', name: 'User 1' }
        },
        {
          id: 'member-2',
          communityId: 'community-id',
          userId: 'user-2',
          roleId: 'role-2',
          user: { id: 'user-2', name: 'User 2' }
        }
      ];
      
      prisma.member.count.mockResolvedValue(15); // Total 15 members
      prisma.member.findMany.mockResolvedValue(memberMocks);

      const result = await getCommunityMembers(communityId, page);

      expect(prisma.community.findUnique).toHaveBeenCalledWith({ where: { slug: 'community-slug' } });
      expect(prisma.member.count).toHaveBeenCalledWith({ where: { communityId: 'community-id' } });
      expect(prisma.member.findMany).toHaveBeenCalledWith({
        where: { communityId: 'community-id' },
        skip: 0, // (page 1 - 1) * 10
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      expect(result).toEqual({
        meta: {
          total: 15,
          pages: 2,
          page: 1
        },
        data: memberMocks
      });
    });

    it('should throw an error if community is not found', async () => {
      prisma.community.findUnique.mockResolvedValue(null);

      await expect(getCommunityMembers('nonexistent-community', 1)).rejects.toThrow('Community not found');
      expect(prisma.member.findMany).not.toHaveBeenCalled();
    });
  });

  describe('getMyOwnedCommunities', () => {
    it('should return paginated owned communities', async () => {
      const userId = 'user-id';
      const page = 1;
      
      const communityMocks = [
        { id: 'community-1', name: 'Community 1', ownerId: userId },
        { id: 'community-2', name: 'Community 2', ownerId: userId }
      ];
      
      prisma.community.count.mockResolvedValue(12); // Total 12 owned communities
      prisma.community.findMany.mockResolvedValue(communityMocks);

      const result = await getMyOwnedCommunities(userId, page);

      expect(prisma.community.count).toHaveBeenCalledWith({
        where: { ownerId: userId }
      });
      expect(prisma.community.findMany).toHaveBeenCalledWith({
        where: { ownerId: userId },
        skip: 0,
        take: 10
      });
      
      expect(result).toEqual({
        meta: {
          total: 12,
          pages: 2,
          page: 1
        },
        data: communityMocks
      });
    });
  });

  describe('getMyJoinedCommunities', () => {
    it('should return paginated joined communities', async () => {
      const userId = 'user-id';
      const page = 1;
      
      const membershipMocks = [
        {
          id: 'membership-1',
          userId: 'user-id',
          communityId: 'community-1',
          community: {
            id: 'community-1',
            name: 'Community 1',
            owner: { id: 'owner-1', name: 'Owner 1' }
          }
        },
        {
          id: 'membership-2',
          userId: 'user-id',
          communityId: 'community-2',
          community: {
            id: 'community-2',
            name: 'Community 2',
            owner: { id: 'owner-2', name: 'Owner 2' }
          }
        }
      ];
      
      prisma.member.count.mockResolvedValue(8); // Total 8 joined communities
      prisma.member.findMany.mockResolvedValue(membershipMocks);

      const result = await getMyJoinedCommunities(userId, page);

      expect(prisma.member.count).toHaveBeenCalledWith({ where: { userId } });
      expect(prisma.member.findMany).toHaveBeenCalledWith({
        where: { userId },
        skip: 0,
        take: 10,
        include: {
          community: {
            include: {
              owner: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });
      
      expect(result).toEqual({
        meta: {
          total: 8,
          pages: 1,
          page: 1
        },
        data: membershipMocks.map(m => m.community)
      });
    });
  });
});
