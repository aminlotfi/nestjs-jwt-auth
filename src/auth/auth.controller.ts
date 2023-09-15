import {Body, Controller, Delete, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthDto} from "./dto";
import {Tokens} from "./types/tokens.type";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @Post('local/signup')
    async localSignup(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.localSignup(dto);
    }

    @Post('local/login')
    async localLogin() {
        return this.authService.localLogin();
    }

    @Post('refresh')
    async refreshToken() {
        return this.authService.refreshToken();
    }

    @Delete('logout')
    async logout() {
        return this.authService.logout();
    }
}
