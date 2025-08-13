import { Expose, Transform, Type } from "class-transformer";
import { CommenterDto } from "./commenter.dot";

export class CommentDto {
    @Expose()
    id: string;

    @Expose()
    content: string;

    @Expose()
    isCommentedByCurrentUser: boolean;

    @Expose()
    @Type(() => CommenterDto)
    user: CommenterDto;

    @Expose()
    @Transform(({ value }) => value ? new Date(value).toLocaleString() : null)
    createdAt: Date;
}