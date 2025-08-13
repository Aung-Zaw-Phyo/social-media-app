import { Expose, Type } from "class-transformer";
import { PostDto } from "./post.dto";

export class PostsListDto {
    @Expose()
    @Type(() => PostDto)
    items: PostDto[];

    @Expose()
    meta: {total: number, page: number, limit: number, last_page: number};
}