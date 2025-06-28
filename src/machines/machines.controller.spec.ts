import { Test, TestingModule } from '@nestjs/testing';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';

describe('MachinesController', () => {
  let controller: MachinesController;

  const mockMachinesService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachinesController],
      providers: [
        {
          provide: MachinesService,
          useValue: mockMachinesService,
        },
      ],
    }).compile();

    controller = module.get<MachinesController>(MachinesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
