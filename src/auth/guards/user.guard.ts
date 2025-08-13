import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { AuthService } from "../auth.service";

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private authService: AuthService,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) return true; 
        try {
            const payload = await this.jwtService.verifyAsync(
                token, 
                { secret: this.configService.get('JWT_SECRET') }
            );
            const user = await this.authService.getUser({ email: payload.userEmail });
            request.user = user || undefined; 
        } catch (error) {
            return true;
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}