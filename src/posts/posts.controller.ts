import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/requests/create-post.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { PaginationDto } from './dto/requests/pagination.dto';
import { PostDto } from './dto/responses/post.dto';
import { UserGuard } from 'src/auth/guards/user.guard';
import { PostsListDto } from './dto/responses/posts-list.dto';
import { CreateCommentDto } from 'src/comments/dto/requests/create-coment.dto';
import { CommentDto } from 'src/comments/dto/responses/comment.dto';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) {}

    @Get()
    @UseGuards(UserGuard)
    @Serialize({dto: PostsListDto, message: "Posts list"})
    getPosts(@Query() paginationDto: PaginationDto, @Req() req) {
        const userId = req.user ? req.user.id : null;
        return this.postsService.getPosts(paginationDto, userId);
    }

    @Get('/:id')
    @UseGuards(UserGuard)
    @Serialize({dto: PostDto, message: "Post details"})
    getPost(@Param('id') id: string, @Req() req) {
        const userId = req.user ? req.user.id : null;
        return this.postsService.getPost(id, userId);
    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize({dto: PostDto, message: "Post created successfully."})
    create(@Body() data: CreatePostDto, @Req() req) {
        return this.postsService.createPost(data, req.user)
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    @Serialize({dto: PostDto, message: "Post deleted successfully."})
    remove(@Param('id') id: string, @Req() req) {
        return this.postsService.removePost(id, req.user)
    }

    @Post('/:id/like')
    @UseGuards(AuthGuard)
    @Serialize({dto: PostDto, message: 'Liked this post successfully.'})
    likePost(@Param('id') id: string, @Req() req) {
        return this.postsService.likePost(id, req.user);
    }

    @Delete('/:id/like')
    @UseGuards(AuthGuard)
    @Serialize({dto: PostDto, message: 'Unlike this post successfully.'})
    unLikePost(@Param('id') id: string, @Req() req) {
        return this.postsService.unLikePost(id, req.user);
    }

    @Post('/:id/comment')
    @UseGuards(AuthGuard)
    @Serialize({dto: CommentDto, message: 'Commented this post successfully.'})
    commentPost(@Param('id') id: string, @Body() data: CreateCommentDto, @Req() req) {
        return this.postsService.commentPost(id, req.user, data);
    }
}
