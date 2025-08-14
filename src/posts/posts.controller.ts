import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/requests/create-post.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { PaginationDto } from './dto/requests/pagination.dto';
import { PostDto } from './dto/responses/post.dto';
import { UserGuard } from 'src/common/guards/user.guard';
import { PostsListDto } from './dto/responses/posts-list.dto';
import { CreateCommentDto } from 'src/comments/dto/requests/create-coment.dto';
import { CommentDto } from 'src/comments/dto/responses/comment.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/common/decorators/api-response.decorator';

@ApiTags("Posts")
@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) {}

    @Get()
    @ApiOperation({summary: "Posts list"})
    @ApiBearerAuth()
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search keyword' })
    @ApiSuccessResponse('Posts list', 200, PostsListDto)
    @UseGuards(UserGuard)
    @Serialize({dto: PostsListDto, message: "Posts list"})
    getPosts(@Query() paginationDto: PaginationDto, @Req() req) {
        const userId = req.user ? req.user.id : null;
        return this.postsService.getPosts(paginationDto, userId);
    }

    @Get('/:id')
    @ApiOperation({summary: "Post details"})
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String, description: 'Post ID', example: 'post-id' })
    @ApiSuccessResponse('Post details', 200, PostDto)
    @ApiErrorResponse('Post not found.', 404, "Not found")
    @UseGuards(UserGuard)
    @Serialize({dto: PostDto, message: "Post details"})
    getPost(@Param('id') id: string, @Req() req) {
        const userId = req.user ? req.user.id : null;
        return this.postsService.getPost(id, userId);
    }

    @Post()
    @ApiOperation({summary: "Create post"})
    @ApiBearerAuth()
    @ApiSuccessResponse('Post created successfully.', 201, PostDto)
    @ApiErrorResponse(['content is required.'], 400, "Bad request")
    @ApiErrorResponse('Unauthenticated', 401, 'Unauthenticated')
    @UseGuards(AuthGuard)
    @Serialize({dto: PostDto, message: "Post created successfully."})
    create(@Body() data: CreatePostDto, @Req() req) {
        return this.postsService.createPost(data, req.user)
    }

    @Delete('/:id')
    @ApiOperation({summary: "Delete post"})
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String, description: 'Post ID', example: 'post-id' })
    @ApiSuccessResponse('Post deleted successfully.', 200, PostDto)
    @ApiErrorResponse('Unauthenticated', 401, 'Unauthenticated')
    @ApiErrorResponse('Post not found.', 404, "Not found")
    @ApiErrorResponse("You don't have permission to delete this post", 403, "Forbidden")
    @UseGuards(AuthGuard)
    @Serialize({dto: PostDto, message: "Post deleted successfully."})
    remove(@Param('id') id: string, @Req() req) {
        return this.postsService.removePost(id, req.user)
    }

    @Post('/:id/like')
    @ApiOperation({summary: "Like post"})
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String, description: 'Post ID', example: 'post-id' })
    @ApiSuccessResponse('Liked this post successfully.', 201, PostDto)
    @ApiErrorResponse('Unauthenticated', 401, 'Unauthenticated')
    @ApiErrorResponse('Post not found.', 404, "Not found")
    @ApiErrorResponse('You have already liked this post', 409, 'Conflict')
    @UseGuards(AuthGuard)
    @Serialize({dto: PostDto, message: 'Liked this post successfully.'})
    likePost(@Param('id') id: string, @Req() req) {
        return this.postsService.likePost(id, req.user);
    }

    @Delete('/:id/like')
    @ApiOperation({summary: "Unlike post"})
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String, description: 'Post ID', example: 'post-id' })
    @ApiSuccessResponse('Unlike this post successfully.', 200, PostDto)
    @ApiErrorResponse('Unauthenticated', 401, 'Unauthenticated')
    @ApiErrorResponse('Post not found.', 404, "Not found")
    @ApiErrorResponse('Like not found.', 404, "Not found")
    @UseGuards(AuthGuard)
    @Serialize({dto: PostDto, message: 'Unlike this post successfully.'})
    unLikePost(@Param('id') id: string, @Req() req) {
        return this.postsService.unLikePost(id, req.user);
    }

    @Post('/:id/comment')
    @ApiOperation({summary: "Comment on post"})
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String, description: 'Post ID', example: 'post-id' })
    @ApiSuccessResponse('Commented this post successfully.', 201, CommentDto)
    @ApiErrorResponse('Unauthenticated', 401, 'Unauthenticated')
    @ApiErrorResponse('Post not found.', 404, "Not found")
    @UseGuards(AuthGuard)
    @Serialize({dto: CommentDto, message: 'Commented this post successfully.'})
    commentPost(@Param('id') id: string, @Body() data: CreateCommentDto, @Req() req) {
        return this.postsService.commentPost(id, req.user, data);
    }
}
