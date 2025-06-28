import { Test, TestingModule } from '@nestjs/testing';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { User } from '../users/user.entity/user.entity';
import { RentalRequest } from './rental-request.entity/rental-request.entity';

describe('RentalsController', () => {
  let controller: RentalsController;
  let service: RentalsService;

  const mockRentalsService = {
    create: jest.fn(),
    findByUser: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: 'customer',
    machines: [],
    rentals: [],
  };

  const mockRequest = {
    user: {
      ...mockUser,
      userId: mockUser.id, // Some endpoints might use userId instead of id
    },
  };

  const mockRental: RentalRequest = {
    id: 1,
    startDate: '2025-06-01',
    endDate: '2025-06-10',
    status: 'pending',
    user: mockUser,
    machine: {
      id: 1,
      name: 'Excavator',
      description: 'Heavy excavator',
      available: true,
      createdBy: mockUser,
      rentals: [],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalsController],
      providers: [
        {
          provide: RentalsService,
          useValue: mockRentalsService,
        },
      ],
    }).compile();

    controller = module.get<RentalsController>(RentalsController);
    service = module.get<RentalsService>(RentalsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createRentalDto: CreateRentalDto = {
      machineId: 1,
      startDate: '2025-06-01',
      endDate: '2025-06-10',
    };

    it('should create a rental successfully', async () => {
      mockRentalsService.create.mockResolvedValue(mockRental);

      const result = await controller.create(createRentalDto, mockRequest);

      expect(service.create).toHaveBeenCalledWith(
        createRentalDto,
        mockRequest.user,
      );
      expect(result).toEqual(mockRental);
    });

    it('should handle service errors when creating rental', async () => {
      const errorMessage = 'La maquina 1 no ha sido encontrada';
      mockRentalsService.create.mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.create(createRentalDto, mockRequest),
      ).rejects.toThrow(errorMessage);

      expect(service.create).toHaveBeenCalledWith(
        createRentalDto,
        mockRequest.user,
      );
    });

    it('should pass the correct user from request to service', async () => {
      mockRentalsService.create.mockResolvedValue(mockRental);

      await controller.create(createRentalDto, mockRequest);

      expect(service.create).toHaveBeenCalledWith(
        createRentalDto,
        mockRequest.user,
      );
    });
  });

  describe('findByUser', () => {
    const mockRentals: RentalRequest[] = [
      mockRental,
      {
        id: 2,
        startDate: '2025-07-01',
        endDate: '2025-07-05',
        status: 'approved',
        user: mockUser,
        machine: {
          id: 2,
          name: 'Bulldozer',
          description: 'Heavy bulldozer',
          available: true,
          createdBy: mockUser,
          rentals: [],
        },
      },
    ];

    it('should return rentals for the authenticated user', async () => {
      mockRentalsService.findByUser.mockResolvedValue(mockRentals);

      const result = await controller.findByUser(mockRequest);

      expect(service.findByUser).toHaveBeenCalledWith(mockRequest.user.userId);
      expect(result).toEqual(mockRentals);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when user has no rentals', async () => {
      mockRentalsService.findByUser.mockResolvedValue([]);

      const result = await controller.findByUser(mockRequest);

      expect(service.findByUser).toHaveBeenCalledWith(mockRequest.user.userId);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle service errors when finding user rentals', async () => {
      const errorMessage = 'Database connection error';
      mockRentalsService.findByUser.mockRejectedValue(new Error(errorMessage));

      await expect(controller.findByUser(mockRequest)).rejects.toThrow(
        errorMessage,
      );

      expect(service.findByUser).toHaveBeenCalledWith(mockRequest.user.userId);
    });

    it('should use userId from request user object', async () => {
      const customRequest = {
        user: {
          ...mockUser,
          userId: 123, // Different userId to test it's being used correctly
        },
      };

      mockRentalsService.findByUser.mockResolvedValue([]);

      await controller.findByUser(customRequest);

      expect(service.findByUser).toHaveBeenCalledWith(123);
    });
  });
});
