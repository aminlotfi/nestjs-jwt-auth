import {ForbiddenException, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {AuthDto} from "./dto";
import * as bcrypt from 'bcrypt';
import {Tokens} from "./types";
import {JwtService} from "@nestjs/jwt";
import {Types} from "mongoose";

@Injectable()
export class AuthService {
    // The constructor injects the UserService and the JwtService.
    constructor(private readonly userService: UserService,
                private jwtService: JwtService
    ) {
    }

    // The localSignup() method creates a new user and returns the tokens.
    async localSignup(dto: AuthDto): Promise<Tokens> {
        // Check if the user exists by email and throw an error if the user exists.
        const userExists = await this.userService.findOneByEmail(dto.email);
        if (userExists) {
            throw new ForbiddenException('User already exists');
        }
        const hashedPassword = this.hashData(dto.password);
        const uniqueId = new Types.ObjectId().toHexString();
        // The create() method of the UserService is used to create a new user.
        const newUser = await this.userService.create({...dto, password: hashedPassword, _id: uniqueId});
        // The getTokens() method is used to get the tokens.
        const tokens = await this.getTokens(newUser._id, newUser.email);
        // The updateRefreshToken() method is used to update the refresh token.
        await this.updateRefreshToken(newUser._id, tokens.refresh_token)
        return tokens;
    }

    // The localLogin() method checks if the user exists and if the password is valid and returns the tokens.
    async localLogin(dto: AuthDto): Promise<Tokens> {
        // The findOneByEmail() method of the UserService is used to find the user by email.
        const user = await this.userService.findOneByEmail(dto.email);
        if (!user) {
            throw new Error('User not found');
        }
        // The compare() method of the bcrypt library is used to compare the password and the hashed password.
        const isPasswordValid = bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Password or email is invalid');
        }
        const tokens = await this.getTokens(user._id, user.email);
        await this.updateRefreshToken(user._id, tokens.refresh_token)
        return tokens;
    }

    // The refreshToken() method checks if the user exists and if the refresh token is valid and returns the tokens.
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

    // The logout() method removes the refresh token from the database.
    async logout(id: string) {
        await this.userService.update(id, {hashedRefreshToken: null});
    }

    // The getTokens() method returns the tokens.
    async getTokens(id: string, email: string): Promise<Tokens> {
        // The signAsync() method of the JwtService is used to sign the payload and return the token.
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

        // The Promise.resolve() method is used to return the tokens.
        return Promise.resolve({
            access_token: at,
            refresh_token: rt
        });
    }

    // The updateRefreshToken() method updates the refresh token.
    async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
        const hashedRefreshToken = this.hashData(refreshToken);
        await this.userService.update(id, {hashedRefreshToken});
    }

    // The hashData() method hashes the data.
    hashData(data: string): string {
        return bcrypt.hashSync(data, 10);
    }
}
