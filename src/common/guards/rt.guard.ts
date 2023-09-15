import {AuthGuard} from "@nestjs/passport";

// RtGuard is a class that extends AuthGuard and uses the jwt-refresh strategy.
export class RtGuard extends AuthGuard('jwt-refresh') {
    constructor() {
        super();
    }
}