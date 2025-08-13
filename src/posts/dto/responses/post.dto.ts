import { Expose, Transform, Type } from "class-transformer";
import { AuthorDto } from "./author.dto";

export class PostDto  {
    @Expose()
    id: string;

    @Expose()
    content: string;

    @Expose()
    imageUrl?: string;

    @Expose()
    likesCount: number;

    @Expose()
    isLikedByCurrentUser: boolean;

    @Expose()
    @Type(() => AuthorDto)
    author: AuthorDto;

    @Expose()
    @Transform(({ value }) => value ? new Date(value).toLocaleString() : null)
    createdAt: Date;

    @Expose()
    @Transform(({ value }) => value ? new Date(value).toLocaleString() : null)
    updatedAt: Date;
}