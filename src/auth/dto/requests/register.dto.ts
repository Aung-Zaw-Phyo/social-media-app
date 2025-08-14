import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword, min, MinLength } from "class-validator";
import { IsUnique } from "src/common/validators/unique.validator";

export class RegisterDto {
    @ApiProperty({example: "Mg Mg", description: "The name of user"})
    @IsString({message: 'Name is required'})
    name: string;

    @ApiProperty({example: "mgmg", description: "The username of user"})
    @IsString()
    @IsUnique({model: 'user', field: 'username'})
    username: string;

    @ApiProperty({example: "mgmg@gmail.com", description: "The email of user"})
    @IsString({message: 'Email is required'})
    @IsEmail({}, {message: 'Email must be a valid email'})
    @IsUnique({model: 'user', field: 'email'})
    email: string;

    @ApiProperty({example: "123456", description: "The password of user"})
    @IsString()
    @MinLength(6, {message: "Password must be at least 6 characters."})
    @IsStrongPassword()
    password: string;
}
