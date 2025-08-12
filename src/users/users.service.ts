import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from 'generated/prisma';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    async createUser(data: {name: string, username: string, email: string, password: string}): Promise<User> {
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

    async getUser(filter: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prismaService.user.findUniqueOrThrow({
            where: filter
        })
    }
}
