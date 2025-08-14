import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";

export class UserDto {
    @ApiProperty({example: "user-id", description: 'The id of user'})
    @Expose()
    id: string;

    @ApiProperty({example: "Mg Mg", description: "The name of user"})
    @Expose()
    name: string;

    @ApiProperty({example: "mgmg", description: "The username of user"})
    @Expose()
    username: string;

    @ApiProperty({example: "mgmg@gmail.com", description: "The email of user"})
    @Expose()
    email: string;
    
    @ApiProperty({example: "8/13/2025, 5:48:00 PM", description: "Created time of user"})
    @Expose()
    @Transform(({ value }) => value ? new Date(value).toLocaleString() : null)
    createdAt?: Date;

    @ApiProperty({example: "8/13/2025, 5:48:00 PM", description: "Updated time of user"})
    @Expose()
    @Transform(({ value }) => value ? new Date(value).toLocaleString() : null)
    updatedAt?: Date;
}