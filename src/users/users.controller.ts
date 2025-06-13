import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':id')
    @ApiOperation({ summary: 'Get the user using their id'})
    @ApiResponse({ status: 200, description: 'User'})
    @ApiResponse({ status: 404, description: 'User not found'})
    findOne(@Param('id') id:string) {
        return this.usersService.findById(Number(id))
    }
}
