import { Expose } from "class-transformer";

export class CommenterDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    username: string;
}