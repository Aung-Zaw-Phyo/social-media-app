import { Expose, Transform, Type } from "class-transformer";
import { CommenterDto } from "./commenter.dot";
import { ApiProperty } from "@nestjs/swagger";

export class CommentDto {
    @ApiProperty({example: "comment-id", description: 'The id of comment'})
    @Expose()
    id: string;

    @ApiProperty({example: "Comment text", description: 'The text of comment'})
    @Expose()
    content: string;

    @ApiProperty({example: true, description: "Whether this comment was made by the current user"})
    @Expose()
    isCommentedByCurrentUser: boolean;

    @ApiProperty({example: {}, description: 'The commenter of comment'})
    @Expose()
    @Type(() => CommenterDto)
    user: CommenterDto;

    @ApiProperty({example: "8/13/2025, 5:48:00 PM", description: 'Created time of comment'})
    @Expose()
    @Transform(({ value }) => value ? new Date(value).toLocaleString() : null)
    createdAt: Date;
}