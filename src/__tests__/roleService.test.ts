const { PrismaClient } = require('@prisma/client');
import { createRole, getAllRoles } from '../services/v1/roleService';

// Mock dependencies
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    role: {
      create: jest.fn(),
      findMany: jest.fn()
    }
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

jest.mock('../utils/id', () => ({
  generateId: jest.fn(() => 'test-role-id')
}));

describe('roleService', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('createRole', () => {
    it('should create a new role', async () => {
      const mockRole = {
        id: 'test-role-id',
        name: 'Test Role',
        scopes: []
      };
      
      prisma.role.create.mockResolvedValue(mockRole);

      const result = await createRole('Test Role');

      expect(prisma.role.create).toHaveBeenCalledWith({
        data: {
          id: 'test-role-id',
          name: 'Test Role',
          scopes: []
        }
      });
      expect(result).toEqual(mockRole);
    });
  });

  describe('getAllRoles', () => {
    it('should return all roles', async () => {
      const mockRoles = [
        { id: 'role-1', name: 'Community Admin', scopes: [] },
        { id: 'role-2', name: 'Community Moderator', scopes: [] },
        { id: 'role-3', name: 'Community Member', scopes: [] }
      ];
      
      prisma.role.findMany.mockResolvedValue(mockRoles);

      const result = await getAllRoles();

      expect(prisma.role.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockRoles);
    });

    it('should return an empty array when no roles exist', async () => {
      prisma.role.findMany.mockResolvedValue([]);

      const result = await getAllRoles();

      expect(prisma.role.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
