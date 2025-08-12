import { Expose, Transform } from "class-transformer";

export class PostDto  {
    @Expose()
    id: string;

    @Expose()
    content: string;

    @Expose()
    imageUrl: string;

    @Expose()
    @Transform(({ value }) => value ? new Date(value).toLocaleString() : null)
    createdAt: Date;

    @Expose()
    @Transform(({ value }) => value ? new Date(value).toLocaleString() : null)
    updatedAt: Date;
}