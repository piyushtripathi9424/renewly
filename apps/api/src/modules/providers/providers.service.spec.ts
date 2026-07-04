import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersService } from './providers.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('ProvidersService', () => {
  let service: ProvidersService;

  const mockPrismaService = {
    provider: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProvidersService>(ProvidersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated providers', async () => {
      mockPrismaService.provider.findMany.mockResolvedValue([{ id: '1', name: 'Netflix' }]);
      mockPrismaService.provider.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10, q: 'Netflix' });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockPrismaService.provider.findMany).toHaveBeenCalled();
      expect(mockPrismaService.provider.count).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a provider by id', async () => {
      mockPrismaService.provider.findUnique.mockResolvedValue({ id: '1', name: 'Netflix' });
      const result = await service.findOne('1');
      expect(result.name).toBe('Netflix');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.provider.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a provider', async () => {
      mockPrismaService.provider.findUnique.mockResolvedValue(null);
      mockPrismaService.provider.create.mockResolvedValue({ id: '1', slug: 'new' });

      const result = await service.create({ name: 'New', slug: 'new', categoryId: '123' });
      expect(result.id).toBe('1');
    });

    it('should throw ConflictException if slug exists', async () => {
      mockPrismaService.provider.findUnique.mockResolvedValue({ id: '2', slug: 'existing' });
      await expect(service.create({ name: 'New', slug: 'existing', categoryId: '123' })).rejects.toThrow(ConflictException);
    });
  });
});
