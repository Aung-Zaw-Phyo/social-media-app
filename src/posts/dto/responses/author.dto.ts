import { Expose } from "class-transformer";

export class AuthorDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    username: string;
}