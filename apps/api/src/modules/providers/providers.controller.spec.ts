import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
describe('ProvidersController', () => {
  let controller: ProvidersController;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findBySlug: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvidersController],
      providers: [
        { provide: ProvidersService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<ProvidersController>(ProvidersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return providers on search', async () => {
    mockService.findAll.mockResolvedValue({ items: [], total: 0 });
    const result = await controller.search({ q: 'test' });
    expect(result.total).toBe(0);
    expect(mockService.findAll).toHaveBeenCalledWith({ q: 'test' });
  });

  it('should get provider by id', async () => {
    mockService.findOne.mockResolvedValue({ id: '1' });
    const result = await controller.findOne('1');
    expect(result.id).toBe('1');
  });
});
