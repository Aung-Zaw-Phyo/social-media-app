import { Expose, Transform, Type } from "class-transformer";
import { AuthorDto } from "./author.dto";
import { CommentDto } from "src/comments/dto/responses/comment.dto";
import { ApiProperty } from "@nestjs/swagger";

export class PostDto  {
    @ApiProperty({example: "post-id", description: 'The id of post'})
    @Expose()
    id: string;

    @ApiProperty({example: "post content", description: 'The content of post'})
    @Expose()
    content: string;

    @ApiProperty({example: "image url", description: 'image url of post'})
    @Expose()
    imageUrl?: string;

    @ApiProperty({example: 342, description: 'The like count of post'})
    @Expose()
    likesCount: number;

    @ApiProperty({example: true, description: "Whether this post was liked by the current user"})
    @Expose()
    isLikedByCurrentUser: boolean;

    @ApiProperty({example: [], description: 'The comments of post'})
    @Expose()
    @Type(() => CommentDto)
    comments: CommentDto[]

    @ApiProperty({example: {}, description: 'The author of post'})
    @Expose()
    @Type(() => AuthorDto)
    author: AuthorDto;

    @ApiProperty({example: "8/13/2025, 5:48:00 PM", description: "Created time of post"})
    @Expose()
    @Transform(({ value }) => value ? new Date(value).toLocaleString() : null)
    createdAt: Date;

    @ApiProperty({example: "8/13/2025, 5:48:00 PM", description: "Updated time of post"})
    @Expose()
    @Transform(({ value }) => value ? new Date(value).toLocaleString() : null)
    updatedAt: Date;
}