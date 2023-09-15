import {ForbiddenException, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {AuthDto} from "./dto";
import * as bcrypt from 'bcrypt';
import {Tokens} from "./types";
import {JwtService} from "@nestjs/jwt";
import {Types} from "mongoose";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
                private jwtService: JwtService
    ) {
    }

    async localSignup(dto: AuthDto): Promise<Tokens> {
        const hashedPassword = this.hashData(dto.password);
        const uniqueId = new Types.ObjectId().toHexString();
        const newUser = await this.userService.create({...dto, password: hashedPassword, _id: uniqueId});
        const tokens = await this.getTokens(newUser._id, newUser.email);
        await this.updateRefreshToken(newUser._id, tokens.refresh_token)
        return tokens;
    }

    async localLogin(dto: AuthDto): Promise<Tokens> {
        const user = await this.userService.findOneByEmail(dto.email);
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Password is invalid');
        }
        const tokens = await this.getTokens(user._id, user.email);
        await this.updateRefreshToken(user._id, tokens.refresh_token)
        return tokens;
    }

    async refreshToken(id: string, refreshToken: string) {
        const user = await this.userService.findOneById(id);
        if (!user || !user.hashedRefreshToken) {
            throw new ForbiddenException('Access denied');
        }
        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!isRefreshTokenValid) {
            throw new ForbiddenException('Access denied');
        }
        const tokens = await this.getTokens(user._id, user.email);
        await this.updateRefreshToken(user._id, tokens.refresh_token)
        return tokens;
    }

    async logout(id: string) {
        await this.userService.update(id, {hashedRefreshToken: null});
    }

    async getTokens(id: string, email: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                id: id,
                email: email
            }, {
                secret: 'at-secret',
                expiresIn: 60 * 15,
            }),
            this.jwtService.signAsync({
                id: id,
                email: email
            }, {
                secret: 'rt-secret',
                expiresIn: 60 * 60 * 24 * 7
            })
        ]);

        return Promise.resolve({
            access_token: at,
            refresh_token: rt
        });
    }

    async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
        const hashedRefreshToken = this.hashData(refreshToken);
        await this.userService.update(id, {hashedRefreshToken});
    }

    hashData(data: string): string {
        return bcrypt.hashSync(data, 10);
    }
}
