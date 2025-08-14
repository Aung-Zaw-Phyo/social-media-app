import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { throwCustomError } from 'src/common/helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    async create(postId: string, userId: string, content: string) {
        try {
            const comment = await this.prismaService.comment.create({
                data: {
                    postId,
                    userId,
                    content,
                },
            })
            return comment;
        } catch (err) {
            throwCustomError("Something wrong", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async remove(commentId: string, userId: string) {
        const comment = await this.prismaService.comment.findUnique({
            where: { id: commentId }
        })
        if(!comment) {
            throwCustomError("Comment not found.", HttpStatus.NOT_FOUND);
        }
        if(comment!.userId !== userId) {
            throwCustomError("You don't have permission to delete this comment", HttpStatus.FORBIDDEN)
        }
        return this.prismaService.comment.delete({where: {id: commentId}});
    }
}
