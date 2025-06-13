import { Request } from "express";
import { UserRole } from "generated/prisma";

export interface JwtPayload {
    sub: string,
    roles: UserRole[]
}

export interface AuthenticatedRequest extends Request {
    user: JwtPayload,
    cookies: {
        token?: string;
        [key: string]: any;
    };
}