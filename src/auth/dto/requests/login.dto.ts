import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({example: "mgmg@gmail.com", description: "The email of user"})
    @IsString()
    @IsEmail({}, {message: 'Email must be a valid email.'})
    email: string;

    @ApiProperty({example: "123456", description: "The password of user"})
    @IsString()
    @MinLength(6, {message: "Password must be at least 6 characters."})
    password: string;
}