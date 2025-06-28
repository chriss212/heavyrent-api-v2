import { Test, TestingModule } from '@nestjs/testing';
import { MachinesService } from './machines.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './machine.entity/machine.entity';
import { UsersService } from 'src/users/users.service';
import { CreateMachineDto } from './dto/create-machine.dto';

describe('MachinesService', () => {
  let service: MachinesService
  let repo: jest.Mocked<Repository<Machine>>
  let usersService: jest.Mocked<UsersService>


  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  }

  const mockUsersService = {
    findById: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MachinesService,
        {
          provide: getRepositoryToken(Machine),
          useValue: mockRepo,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile()

    service = module.get<MachinesService>(MachinesService);
    repo = module.get(getRepositoryToken(Machine));
    usersService = module.get(UsersService);
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('debería crear una máquina si el usuario existe', async () => {
    const dto = { name: 'Excavadora', description: 'Para cavar' };
    const user = { id: 1 };
    const machine = { ...dto, createdBy: user, available: true };


    mockUsersService.findById.mockResolvedValue(user);
    mockRepo.create.mockReturnValue(machine);
    mockRepo.save.mockResolvedValue({ id: 10, ...machine });

    const result = await service.create(dto, { userId: 1 });

    expect(result.id).toBe(10);
    expect(result.available).toBe(true);
  });


  it('debería lanzar error si el usuario no existe', async () => {
    usersService.findById.mockResolvedValue(null);
    const dto = { name: 'Tractor', description: 'Agrícola' };

    await expect(service.create(dto, { userId: 999 })).rejects.toThrow('usuario no encontrado');
  });



  it('debería retornar todas las máquinas con sus relaciones', async () => {
    const machines = [{ id: 1, name: 'Camión', createdBy: { id: 1 } }];
    mockRepo.find.mockResolvedValue(machines);

    const result = await service.findAll();

    expect(result).toEqual(machines);
  });



  it('debería crear una máquina con campos mínimos esperados', async () => {
    const dto = { name: 'Grúa', description: 'Levanta cosas' }
    const user = { id: 2, name: 'Luis' }
    const machine = { ...dto, createdBy: user, available: true }

    mockUsersService.findById.mockResolvedValue(user);
    mockRepo.create.mockReturnValue(machine);
    mockRepo.save.mockResolvedValue({ id: 42, ...machine })

    const result = await service.create(dto, { userId: 2 })

    expect(result).toEqual({ id: 42, ...machine })
  });



  it('debería llamar a repo.create con los datos correctos', async () => {
    const dto = { name: 'Bulldozer', description: 'Nivelar terreno' };
    const user = { id: 5 };

    mockUsersService.findById.mockResolvedValue(user);
    mockRepo.create.mockReturnValue({ ...dto, createdBy: user, available: true });
    mockRepo.save.mockResolvedValue({ id: 20, ...dto, createdBy: user, available: true });

    await service.create(dto, { userId: 5 });

    expect(mockRepo.create).toHaveBeenCalledWith({
      name: dto.name,
      description: dto.description,
      createdBy: user,
      available: true,
    });
  });




  it('debería llamar a repo.save con el objeto creado', async () => {
    const dto = { name: 'Grúa', description: 'Levanta cargas' };
    const user = { id: 6 };
    const machine = { ...dto, createdBy: user, available: true };

    mockUsersService.findById.mockResolvedValue(user);
    mockRepo.create.mockReturnValue(machine);
    mockRepo.save.mockResolvedValue({ id: 30, ...machine });

    await service.create(dto, { userId: 6 });

    expect(mockRepo.save).toHaveBeenCalledWith(machine);

    })

  it('debería llamar a usersService.findById con el userId correcto', async () => {
    const dto = { name: 'Montacargas', description: 'Transporte de carga' };
    const user = { id: 3 };

    mockUsersService.findById.mockResolvedValue(user);
    mockRepo.create.mockReturnValue({ ...dto, createdBy: user, available: true });
    mockRepo.save.mockResolvedValue({ id: 15, ...dto, createdBy: user, available: true });

    await service.create(dto, { userId: 3 });

    expect(mockUsersService.findById).toHaveBeenCalledWith(3);
  });

  it('debería llamar a repo.find con las relaciones correctas', async () => {
    const machines = [{ id: 1, name: 'Retroexcavadora' }];
    mockRepo.find.mockResolvedValue(machines);

    await service.findAll();

    expect(mockRepo.find).toHaveBeenCalledWith({
      relations: ['createdBy'],
    });
  });

  it('debería retornar máquina con available true por defecto', async () => {
    const dto = { name: 'Compactadora', description: 'Compacta suelo' };
    const user = { id: 4 };

    mockUsersService.findById.mockResolvedValue(user);
    mockRepo.create.mockReturnValue({ ...dto, createdBy: user, available: true });
    mockRepo.save.mockResolvedValue({ id: 25, ...dto, createdBy: user, available: true });

    const result = await service.create(dto, { userId: 4 });

    expect(result.available).toBe(true);
  });

  it('debería manejar descripción vacía correctamente', async () => {
    const dto = { name: 'Martillo neumático', description: '' };
    const user = { id: 7 };

    mockUsersService.findById.mockResolvedValue(user);
    mockRepo.create.mockReturnValue({ ...dto, createdBy: user, available: true });
    mockRepo.save.mockResolvedValue({ id: 35, ...dto, createdBy: user, available: true });

    const result = await service.create(dto, { userId: 7 });

    expect(result.description).toBe('');
    expect(result.name).toBe('Martillo neumático');
  });



})
