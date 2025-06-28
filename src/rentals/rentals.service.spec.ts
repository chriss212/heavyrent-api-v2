import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentalsService } from './rentals.service';
import { RentalRequest } from './rental-request.entity/rental-request.entity';
import { Machine } from '../machines/machine.entity/machine.entity';
import { User } from '../users/user.entity/user.entity';
import { CreateRentalDto } from './dto/create-rental.dto';

describe('RentalsService', () => {
  let service: RentalsService;
  let rentalRepository: Repository<RentalRequest>;
  let machineRepository: Repository<Machine>;

  const mockRentalRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockMachineRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsService,
        {
          provide: getRepositoryToken(RentalRequest),
          useValue: mockRentalRepository,
        },
        {
          provide: getRepositoryToken(Machine),
          useValue: mockMachineRepository,
        },
      ],
    }).compile();

    service = module.get<RentalsService>(RentalsService);
    rentalRepository = module.get<Repository<RentalRequest>>(
      getRepositoryToken(RentalRequest),
    );
    machineRepository = module.get<Repository<Machine>>(
      getRepositoryToken(Machine),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'customer',
      machines: [],
      rentals: [],
    };

    const mockMachine: Machine = {
      id: 1,
      name: 'Excavator',
      description: 'Heavy excavator',
      available: true,
      createdBy: mockUser,
      rentals: [],
    };

    const createRentalDto: CreateRentalDto = {
      machineId: 1,
      startDate: '2025-06-01',
      endDate: '2025-06-10',
    };

    it('should create a rental successfully', async () => {
      const expectedRental = {
        id: 1,
        startDate: createRentalDto.startDate,
        endDate: createRentalDto.endDate,
        machine: mockMachine,
        user: { id: mockUser.id },
        status: 'pending',
      };

      mockMachineRepository.findOneBy.mockResolvedValue(mockMachine);
      mockRentalRepository.create.mockReturnValue(expectedRental);
      mockRentalRepository.save.mockResolvedValue(expectedRental);

      const result = await service.create(createRentalDto, mockUser);

      expect(mockMachineRepository.findOneBy).toHaveBeenCalledWith({
        id: createRentalDto.machineId,
      });
      expect(mockRentalRepository.create).toHaveBeenCalledWith({
        startDate: createRentalDto.startDate,
        endDate: createRentalDto.endDate,
        machine: mockMachine,
        user: { id: mockUser.id },
        status: 'pending',
      });
      expect(mockRentalRepository.save).toHaveBeenCalledWith(expectedRental);
      expect(result).toEqual(expectedRental);
    });

    it('should throw an error when machine is not found', async () => {
      mockMachineRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createRentalDto, mockUser)).rejects.toThrow(
        `La maquina ${createRentalDto.machineId} no ha sido encontrada`,
      );

      expect(mockMachineRepository.findOneBy).toHaveBeenCalledWith({
        id: createRentalDto.machineId,
      });
      expect(mockRentalRepository.create).not.toHaveBeenCalled();
      expect(mockRentalRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findByUser', () => {
    const userId = 1;
    const mockRentals: RentalRequest[] = [
      {
        id: 1,
        startDate: '2025-06-01',
        endDate: '2025-06-10',
        status: 'pending',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'customer',
          machines: [],
          rentals: [],
        },
        machine: {
          id: 1,
          name: 'Excavator',
          description: 'Heavy excavator',
          available: true,
          createdBy: {} as User,
          rentals: [],
        },
      },
      {
        id: 2,
        startDate: '2025-07-01',
        endDate: '2025-07-05',
        status: 'approved',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'customer',
          machines: [],
          rentals: [],
        },
        machine: {
          id: 2,
          name: 'Bulldozer',
          description: 'Heavy bulldozer',
          available: true,
          createdBy: {} as User,
          rentals: [],
        },
      },
    ];

    it('should return rentals for a user', async () => {
      mockRentalRepository.find.mockResolvedValue(mockRentals);

      const result = await service.findByUser(userId);

      expect(mockRentalRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['machine', 'user'],
      });
      expect(result).toEqual(mockRentals);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when user has no rentals', async () => {
      mockRentalRepository.find.mockResolvedValue([]);

      const result = await service.findByUser(userId);

      expect(mockRentalRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['machine', 'user'],
      });
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
