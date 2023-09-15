import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Injectable} from "@nestjs/common";

type Payload = {
    id: string;
    email: string;
}

// AtStrategy is a class that extends PassportStrategy and uses the jwt strategy.
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'at-secret',
        });
    }

    // The validate() method is called after the token is decoded.
    validate(payload: Payload) {
        return payload;
    }
}