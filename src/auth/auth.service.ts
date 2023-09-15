import {Injectable} from '@nestjs/common';
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
    ) {}

    async localSignup(dto: AuthDto): Promise<Tokens> {
        const hashedPassword = this.hashData(dto.password);
        const uniqueId = new Types.ObjectId().toHexString();
        const newUser = await this.userService.create({...dto, password: hashedPassword, _id: uniqueId});
        const tokens = await this.getTokens(newUser._id, newUser.email);
        await this.updateRefreshToken(newUser._id, tokens.refresh_token)
        return tokens;
    }

    localLogin() {

    }

    refreshToken() {

    }

    logout() {

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
        await this.userService.update(id, {refreshToken: hashedRefreshToken});
    }

    hashData(data: string): string {
        return bcrypt.hashSync(data, 10);
    }
}
