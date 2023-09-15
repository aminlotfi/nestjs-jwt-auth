import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Request} from 'express';
import {Injectable} from "@nestjs/common";

// RtStrategy is a class that extends PassportStrategy and uses the jwt strategy.
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'rt-secret',
            passReqToCallback: true,
        });
    }

    // The validate() method is called after the token is decoded.
    validate(req: Request, payload: any) {
        const refreshToken = req.get('Authorization').split(' ')[1];
        return {
            ...payload,
            refreshToken,
        };
    }
}