import { Controller, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CommentDto } from './dto/responses/comment.dto';

@Controller('comments')
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService,
    ) {}

    @Delete('/:id')
    @UseGuards(AuthGuard)
    @Serialize({dto: CommentDto, message: "Comment deleted successfully."})
    remove(@Param('id') id: string, @Req() req) {
        return this.commentsService.remove(id, req.user.id);
    }
}
