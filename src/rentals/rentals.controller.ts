import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsingJoinTableOnlyOnOneSideAllowedError } from 'typeorm';

@ApiTags('rentals')
@ApiBearerAuth()
@Controller('rentals')
export class RentalsController {
    constructor(
        private readonly rentalsService: RentalsService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new rental' })
    @ApiResponse({ status: 201, description: 'Rental created successfully.'})
    @UseGuards(AuthGuard('jwt'))
    create(@Body() dto: CreateRentalDto, @Req() req) {
        return this.rentalsService.create(dto, req.user)
    }

    @Get()
    @ApiOperation({ summary: 'Get all rentals' })
    @ApiResponse({ status: 200, description: 'List of all rentals'})
    @UseGuards(AuthGuard('jwt'))
    findByUser(@Req() req) {
        return this.rentalsService.findByUser(req.user.userId)
    }
}