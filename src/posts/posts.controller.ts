import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/requests/create-post.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { PostDto } from './dto/responses/post.dto';

@Controller('posts')
@Serialize({dto: PostDto})
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) {}

    @Get()
    getPosts() {
        return this.postsService.getPosts();
    }

    @Get('/:id')
    getPost(@Param('id') id: string) {
        return this.postsService.getPost(id);
    }

    @Post()
    @UseGuards(AuthGuard)
    create(@Body() data: CreatePostDto, @Req() req) {
        return this.postsService.createPost(data, req.user)
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    remove(@Param('id') id: string, @Req() req) {
        return this.postsService.removePost(id, req.user)
    }
}
