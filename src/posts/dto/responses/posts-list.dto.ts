import { Expose, Type } from "class-transformer";
import { PostDto } from "./post.dto";
import { ApiProperty } from "@nestjs/swagger";

export class PostsListDto {
    @ApiProperty({example: [], description: "posts list"})
    @Expose()
    @Type(() => PostDto)
    items: PostDto[];

    @ApiProperty({example: {total: 124, page: 1, limit: 10, last_page: 13}, description: "Meta data for pagination info"})
    @Expose()
    meta: {total: number, page: number, limit: number, last_page: number};
}