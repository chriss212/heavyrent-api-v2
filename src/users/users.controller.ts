import { Controller, Get, Param, Post, Body, Delete, NotFoundException, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los usuarios'})
    @ApiResponse({ status: 200, description: 'Lista de usuarios'})
    findAll() {
        return this.usersService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Crear un usuario'})
    @ApiResponse({ status: 201, description: 'Usuario creado'})
    async create(@Body() body: { name: string, email: string }) {
        // Usamos findOrCreate para evitar duplicados
        const user = await this.usersService.findOrCreate(body);
        return user;
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener usuario por id'})
    @ApiResponse({ status: 200, description: 'Usuario'})
    @ApiResponse({ status: 404, description: 'Usuario no encontrado'})
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findById(Number(id));
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar usuario por id'})
    @ApiResponse({ status: 200, description: 'Usuario eliminado'})
    @ApiResponse({ status: 404, description: 'Usuario no encontrado'})
    @HttpCode(200)
    async remove(@Param('id') id: string) {
        const user = await this.usersService.findById(Number(id));
        if (!user) throw new NotFoundException('Usuario no encontrado');
        await this.usersService['userRepository'].delete(user.id);
        return { message: 'Usuario eliminado' };
    }
}
