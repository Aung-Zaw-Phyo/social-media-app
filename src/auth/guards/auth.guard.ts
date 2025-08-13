import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { throwCustomError } from "../../common/helper";
import { AuthService } from "../auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private authService: AuthService,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token) {
            throwCustomError('Unauthenticated', HttpStatus.UNAUTHORIZED);
        }
        
        try {
            const payload = await this.jwtService.verifyAsync(token!, {secret: this.configService.get('JWT_ACCESS_SECRET')});
            const user = await this.authService.getUser({email: payload.email});
            if (!user) {
                throwCustomError('Unauthenticated', HttpStatus.UNAUTHORIZED);
            }
            request['user'] = user;
        } catch (error) {
            throwCustomError('Unauthenticated', HttpStatus.UNAUTHORIZED);
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}