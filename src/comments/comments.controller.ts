import { Controller, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CommentDto } from './dto/responses/comment.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/common/decorators/api-response.decorator';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService,
    ) {}

    @Delete('/:id')
    @ApiOperation({summary: "Delete comment"})
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String, description: 'Comment ID', example: 'comment-id' })
    @ApiSuccessResponse('Comment deleted successfully.', 201, CommentDto)
    @ApiErrorResponse('Comment not found.', 404, "Not found")
    @ApiErrorResponse('Unauthenticated', 401, 'Unauthenticated')
    @ApiErrorResponse("You don't have permission to delete this comment", 403, "Forbidden")
    @UseGuards(AuthGuard)
    @Serialize({dto: CommentDto, message: "Comment deleted successfully."})
    remove(@Param('id') id: string, @Req() req) {
        return this.commentsService.remove(id, req.user.id);
    }
}
