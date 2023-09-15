import {AuthGuard} from "@nestjs/passport";
import {Reflector} from "@nestjs/core";
import {ExecutionContext, Injectable} from "@nestjs/common";

// AtGuard is a class that extends AuthGuard and uses the jwt strategy.
@Injectable()
export class AtGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    // The canActivate() method is called before the route is activated.
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        return super.canActivate(context);
    }
}