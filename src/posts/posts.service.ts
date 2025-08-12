import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { CreatePostDto } from './dto/requests/create-post.dto';
import { Post, User, Prisma } from 'generated/prisma';
import { throwCustomError } from 'src/common/helper';
import { PaginationDto } from './dto/requests/pagination.dto';

@Injectable()
export class PostsService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    async getPosts(paginationDto: PaginationDto) {
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const search = paginationDto.search
        const skip = (page - 1) * limit;

        const where = search ? { 
            OR: [ { content: { contains: search, mode: Prisma.QueryMode.insensitive } }, ],
        } : undefined;

        const [data, total] = await Promise.all([
            this.prismaService.post.findMany({
                skip,
                take: limit,
                where: where,
            }),
            this.prismaService.post.count({
                where: where,
            }),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                last_page: Math.ceil(total / limit)
            }
        };
    }

    async getPost(postId: string) {
        const post = await this.prismaService.post.findUnique({
            where: {id: postId}
        })
        if(!post) {
            throwCustomError('Post not found.', HttpStatus.NOT_FOUND);
        }
        return post;
    }

    async createPost(data: CreatePostDto, user: User) {
        try {
            return await this.prismaService.post.create({
                data: {
                    ...data,
                    authorId: user.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            })
        } catch (err) {
            throw new HttpException('Something wrong!', HttpStatus.INTERNAL_SERVER_ERROR, err);
        }
    }

    async removePost(postId, user: User) {
        const post = await this.getPost(postId);
        if(post!.authorId !== user.id) {
            throwCustomError("You don't have permission to delete this post", HttpStatus.FORBIDDEN)
        }
        return this.prismaService.post.delete({where: {id: post!.id}})
    }
}
