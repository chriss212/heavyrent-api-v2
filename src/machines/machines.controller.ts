import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('machines')
@ApiBearerAuth()
@Controller('machines')
export class MachinesController {
    constructor(
        private readonly machinesService: MachinesService
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new machine' })
    @ApiResponse({ status: 201, description: 'Machine created successfully.'})
    @UseGuards(AuthGuard('jwt'))
    create(@Body() dto: CreateMachineDto, @Req() req) {
        return this.machinesService.create(dto, req.user)
    }

    @Get()
    @ApiOperation({ summary: 'Get all machines'})
    @ApiResponse({ status: 200, description: 'List of all machines'})
    @ApiResponse({ status: 404, description: 'User not found'})

    findAll() {
        return this.machinesService.findAll()
    }
}
