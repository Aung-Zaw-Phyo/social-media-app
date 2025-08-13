import { HttpStatus, Injectable } from '@nestjs/common';
import { throwCustomError } from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikesService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    async create(postId: string, userId: string) {
        try {
            const like = await this.prismaService.like.create({
                data: {
                    postId,
                    userId,
                },
                include: {
                    post: true,
                    user: true,
                }
            })
            return like;
        } catch (err) {
            if (err.code === 'P2002') {
                throwCustomError('You have already liked this post', HttpStatus.CONFLICT);
            }
            throw err;
        }
    }

    async remove(postId: string, userId: string) {
        const like = await this.prismaService.like.delete({
            where: {
                userId_postId: {
                    userId,
                    postId,
                }
            }
        })
        if(!like) {
            throwCustomError("Like not found.", HttpStatus.NOT_FOUND);
        }
        return like;
    }
}
