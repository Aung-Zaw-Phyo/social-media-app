import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/requests/register.dto';
import { LoginDto } from './dto/requests/login.dto';
import { throwCustomError } from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from 'generated/prisma';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async register(data: RegisterDto) {
        try {
            return await this.prismaService.user.create({
                data: {
                    ...data,
                    password: await bcrypt.hash(data.password, 10),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            })
        } catch (err) {
            throw new HttpException('Something wrong!', HttpStatus.INTERNAL_SERVER_ERROR, err);
        }
    }

    async login(data: LoginDto) {
        const user = await this.getUser({email: data.email});
        if(!user) {
            throwCustomError('Your credentials are incorrect!');
        }
        if(!(await bcrypt.compare(data.password, user!.password))) {
            throwCustomError('Your password is incorrect!');
        }
        const access_token = await this.jwtService.sign({userId: user!.id, userEmail: user!.email});
        return { access_token };
    }

    async getUser(filter: Prisma.UserWhereUniqueInput): Promise<User | null> {
        return this.prismaService.user.findUnique({
            where: filter
        })
    }
}
