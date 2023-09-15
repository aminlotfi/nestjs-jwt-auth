import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthDto} from "./dto";
import {Tokens} from "./types";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    async localSignup(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.localSignup(dto);
    }

    @Post('local/login')
    @HttpCode(HttpStatus.OK)
    async localLogin(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.localLogin(dto);
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Get('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Req() req: Request) {
        const user = req.user;
        return this.authService.refreshToken(user['id'], user['refreshToken']);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request) {
        const user = req.user;
        return this.authService.logout(user['id']);
    }
}
