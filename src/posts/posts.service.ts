import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { CreatePostDto } from './dto/requests/create-post.dto';
import { User, Prisma } from 'generated/prisma';
import { throwCustomError } from 'src/common/helper';
import { PaginationDto } from './dto/requests/pagination.dto';
import { LikesService } from 'src/likes/likes.service';
import { CommentsService } from 'src/comments/comments.service';
import { CreateCommentDto } from 'src/comments/dto/requests/create-coment.dto';

@Injectable()
export class PostsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly commentsService: CommentsService,
        private readonly likesService: LikesService,
    ) {}

    async getPosts(paginationDto: PaginationDto, userId?: string) {
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
                include: {
                    author: {
                        select: { id: true, name: true, username: true }
                    },
                    Like: {
                        select: { userId: true }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                }
            }),
            this.prismaService.post.count({
                where: where,
            }),
        ]);

        const posts = data.map((post) => ({
            ...post,
            likesCount: post.Like.length,
            isLikedByCurrentUser: userId ? post.Like.some(like => like.userId === userId) : false, 
        }))

        return {
            items: posts,
            meta: {
                total,
                page,
                limit,
                last_page: Math.ceil(total / limit)
            }
        };
    }

    async getPost(postId: string, userId?: string) {
        const post = await this.prismaService.post.findUnique({
            where: {id: postId},
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    }
                },
                Comment: {
                    select: { 
                        id: true,
                        content: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                            }
                        }
                    }
                },
                Like: {
                    select: {
                        userId: true
                    }
                },
            }
        })
        if(!post) {
            throwCustomError('Post not found.', HttpStatus.NOT_FOUND);
        }
        const comments = post!.Comment.map((comment) => ({
            ...comment,
            isCommentedByCurrentUser: userId ? comment.user.id === userId : false, 
        }))
        return {
            ...post, 
            comments: comments,
            likesCount: post!.Like.length, 
            isLikedByCurrentUser:  userId ? post!.Like.some(like => like.userId === userId) : false,
        };
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
                include: {
                    author: true
                }
            })
        } catch (err) {
            throwCustomError("Something wrong", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async removePost(postId: string, user: User) {
        const post = await this.getPost(postId);
        if(post!.authorId !== user.id) {
            throwCustomError("You don't have permission to delete this post", HttpStatus.FORBIDDEN)
        }
        return this.prismaService.post.delete({where: {id: post!.id}})
    }

    async likePost(postId: string, user: User) {
        await this.getPost(postId);
        await this.likesService.create(postId, user.id);
        return this.getPost(postId, user.id);
    }

    async unLikePost(postId: string, user: User) {
        await this.getPost(postId);
        await this.likesService.remove(postId, user.id);
        return this.getPost(postId, user.id);
    }

    async commentPost(postId: string, user: User, data: CreateCommentDto) {
        await this.getPost(postId);
        const comment = await this.commentsService.create(postId, user.id, data.content);
        return comment;
    }
}
