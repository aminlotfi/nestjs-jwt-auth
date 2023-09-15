import {createParamDecorator, ExecutionContext} from "@nestjs/common";

// The getCurrentUser() decorator is used to get the current user.
export const getCurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return data ? request.user?.[data] : request.user;
    }
)