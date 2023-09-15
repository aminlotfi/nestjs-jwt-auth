import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthDto} from "./dto";
import {Tokens} from "./types";
import {RtGuard} from "../common/guards";
import {getCurrentUser, Public} from "../common/decorators";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @Public()
    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    async localSignup(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.localSignup(dto);
    }

    @Public()
    @Post('local/login')
    @HttpCode(HttpStatus.OK)
    async localLogin(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.localLogin(dto);
    }

    @Public()
    @UseGuards(RtGuard)
    @Get('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshToken(
        @getCurrentUser('id') id: string,
        @getCurrentUser('refreshToken') refreshToken: string) {
        return this.authService.refreshToken(id, refreshToken);
    }

    @Delete('logout')
    @HttpCode(HttpStatus.OK)
    async logout( @getCurrentUser('id') id: string,) {
        return this.authService.logout(id);
    }
}
