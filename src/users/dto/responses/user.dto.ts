import { Expose, Transform } from "class-transformer";

export class UserDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    username: string;

    @Expose()
    email: string;
    
    @Expose()
    @Transform(({ value }) => value ? new Date(value).toLocaleString() : null)
    createdAt: Date;

    @Expose()
    @Transform(({ value }) => value ? new Date(value).toLocaleString() : null)
    updatedAt: Date;
}