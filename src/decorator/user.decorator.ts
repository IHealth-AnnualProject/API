import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import {jwtConstants} from "../auth/constants";

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

export const UserWS = createParamDecorator(
    (data:unknown,ctx: ExecutionContext) => {
        const authToken = ctx.getArgs()[1].token;
        const user:any = jwt.verify(authToken, jwtConstants.secret);
        return {username:user.username,id:user.sub,isPsy:user.isPsy}
    },
);

export const SocketWS = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        return ctx.getArgs()[0];
    },
);

export const Message = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        return ctx.getArgs()[1].data;
    },
);