import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Get('google')
    @ApiOperation({ summary: 'Redirect to Google for authentication'})
    @UseGuards(AuthGuard('google'))
    async googleAuth() { }

    @Get('google/redirect') 
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        return this.authService.validateOAuthLogin(req.user.email, req.user.name)
    }
}
