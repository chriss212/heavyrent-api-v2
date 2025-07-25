import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: User = {
    id: 1,
    name: 'Usuario de Prueba',
    email: 'test@example.com',
    role: 'customer',
    machines: [],
    rentals: [],
  };

  const mockUsersService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('debería retornar un usuario cuando se proporciona un ID válido', async () => {
      const userId = '1';

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.findOne(userId);

      expect(service.findById).toHaveBeenCalledWith(Number(userId));
      expect(result).toEqual(mockUser);
    });

    it('debería lanzar NotFoundException cuando el usuario con ID no existe', async () => {
      const userId = '999';

      mockUsersService.findById.mockResolvedValue(null);

      await expect(controller.findOne(userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.findOne(userId)).rejects.toThrow(
        'Usuario no encontrado',
      );

      expect(service.findById).toHaveBeenCalledWith(Number(userId));
    });

    it('debería manejar la conversión de ID string a número', async () => {
      const userId = '123';

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.findOne(userId);

      expect(service.findById).toHaveBeenCalledWith(123);
      expect(result).toEqual(mockUser);
    });

    it('debería lanzar NotFoundException para ID cero cuando no existe', async () => {
      const userId = '0';

      mockUsersService.findById.mockResolvedValue(null);

      await expect(controller.findOne(userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.findOne(userId)).rejects.toThrow(
        'Usuario no encontrado',
      );

      expect(service.findById).toHaveBeenCalledWith(0);
    });

    it('debería lanzar NotFoundException para ID negativo cuando no existe', async () => {
      const userId = '-1';

      mockUsersService.findById.mockResolvedValue(null);

      await expect(controller.findOne(userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.findOne(userId)).rejects.toThrow(
        'Usuario no encontrado',
      );

      expect(service.findById).toHaveBeenCalledWith(-1);
    });
  });
});
