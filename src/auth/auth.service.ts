import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/requests/register.dto';
import { LoginDto } from './dto/requests/login.dto';
import { throwCustomError } from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from 'generated/prisma';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/requests/refresh-token.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { error } from 'console';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async register(data: RegisterDto) {
        try {
            await this.prismaService.user.create({
                data: {
                    ...data,
                    password: await bcrypt.hash(data.password, 10),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            })
            return;
        } catch (err) {
            throw new HttpException('Something wrong!', HttpStatus.INTERNAL_SERVER_ERROR, err);
        }
    }

    async login(data: LoginDto) {
        const user = await this.prismaService.user.findUnique({
            where: {email: data.email}
        });
        if(!user) {
            throwCustomError('Your credentials are incorrect!', HttpStatus.UNAUTHORIZED);
        }
        if(!(await bcrypt.compare(data.password, user!.password))) {
            throwCustomError('Your password is incorrect!', HttpStatus.UNAUTHORIZED);
        }
        const tokens = await this.generateTokens(user!.id, user!.email);
        await this.storeRefreshToken(user!.id, tokens.refreshToken);
        return tokens;
    }

    async refreshTokens(dto: RefreshTokenDto) {
        const storedToken = await this.prismaService.refreshToken.findUnique({
            where: { token: dto.refreshToken },
            include: { user: true },
        });
        if (!storedToken) throwCustomError('Invalid refresh token', HttpStatus.FORBIDDEN);
        if (storedToken!.expiresAt < new Date()) {
            await this.prismaService.refreshToken.delete({ where: { id: storedToken!.id } });
            throwCustomError('Refresh token expired', HttpStatus.FORBIDDEN)
        }
        const tokens = await this.generateTokens(storedToken!.userId, storedToken!.user.email);
        await this.storeRefreshToken(storedToken!.userId, tokens.refreshToken);
        await this.prismaService.refreshToken.delete({ where: { id: storedToken!.id } });
        return tokens;
    }

    async logout(refreshToken: string) {
        await this.prismaService.refreshToken.deleteMany({ where: { token: refreshToken } });
        return;
    }

    @Serialize()
    async generateTokens(userId: string, email: string) {
        const accessToken = await this.jwtService.sign(
            {sub: userId, email}, 
            {
                secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'), 
                expiresIn: '2m',
            }
        );
        const refreshToken = await this.jwtService.sign(
            {sub: userId, email}, 
            {
                secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'), 
                expiresIn: '4m',
            }
        );

        return {accessToken, refreshToken};
    }

    async storeRefreshToken(userId: string, refreshToken: string) {
        await this.prismaService.refreshToken.create({
            data: {
                token: refreshToken,
                userId,
                expiresAt: new Date(Date.now() + 6 * 60 * 1000), 
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }
}
