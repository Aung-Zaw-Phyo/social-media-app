import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/requests/create-post.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { PaginationDto } from './dto/requests/pagination.dto';
import { PostDto } from './dto/responses/post.dto';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) {}

    @Get()
    @Serialize()
    getPosts(@Query() paginationDto: PaginationDto) {
        return this.postsService.getPosts(paginationDto);
    }

    @Get('/:id')
    @Serialize({dto: PostDto})
    getPost(@Param('id') id: string) {
        return this.postsService.getPost(id);
    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize({dto: PostDto})
    create(@Body() data: CreatePostDto, @Req() req) {
        return this.postsService.createPost(data, req.user)
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    @Serialize({dto: PostDto})
    remove(@Param('id') id: string, @Req() req) {
        return this.postsService.removePost(id, req.user)
    }
}
