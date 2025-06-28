import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: User = {
    id: 1,
    name: 'Usuario de Prueba',
    email: 'test@example.com',
    role: 'customer',
    machines: [],
    rentals: []
  };

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findOrCreate', () => {
    it('debería retornar un usuario existente cuando el usuario con email ya existe', async () => {
      const userData = { email: 'test@example.com', name: 'Usuario de Prueba' };
      
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOrCreate(userData);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ 
        where: { email: userData.email } 
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('debería crear y retornar un nuevo usuario cuando el usuario con email no existe', async () => {
      const userData = { email: 'nuevo@example.com', name: 'Nuevo Usuario' };
      const newUser = { ...mockUser, ...userData, id: 2 };
      
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(newUser);
      mockRepository.save.mockResolvedValue(newUser);

      const result = await service.findOrCreate(userData);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ 
        where: { email: userData.email } 
      });
      expect(mockRepository.create).toHaveBeenCalledWith(userData);
      expect(mockRepository.save).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(newUser);
    });
  });

  describe('findById', () => {
    it('debería retornar un usuario cuando se proporciona un ID válido', async () => {
      const userId = 1;
      
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(userId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: userId } 
      });
      expect(result).toEqual(mockUser);
    });

    it('debería retornar null cuando el usuario con ID no existe', async () => {
      const userId = 999;
      
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(userId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: userId } 
      });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los usuarios', async () => {
      const users = [mockUser, { ...mockUser, id: 2, email: 'test2@example.com' }];
      
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('debería retornar un array vacío cuando no existen usuarios', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
