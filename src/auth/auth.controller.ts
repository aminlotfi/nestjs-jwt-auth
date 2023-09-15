import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthDto} from "./dto";
import {Tokens} from "./types";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {AtGuard, RtGuard} from "../common/guards";
import {getCurrentUser} from "../common/decorators";

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

    @UseGuards(RtGuard)
    @Get('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshToken(
        @getCurrentUser('id') id: string,
        @getCurrentUser('refreshToken') refreshToken: string) {
        return this.authService.refreshToken(id, refreshToken);
    }

    @UseGuards(AtGuard)
    @Delete('logout')
    @HttpCode(HttpStatus.OK)
    async logout( @getCurrentUser('id') id: string,) {
        return this.authService.logout(id);
    }
}
