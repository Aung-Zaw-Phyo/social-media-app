import { IsEmail, IsString, IsStrongPassword, min, MinLength } from "class-validator";
import { IsUnique } from "src/common/validators/unique.validator";

export class RegisterDto {
    @IsString({message: 'Name is required'})
    name: string;

    @IsString()
    @IsUnique({model: 'user', field: 'username'})
    username: string;

    @IsString({message: 'Email is required'})
    @IsEmail({}, {message: 'Email must be a valid email'})
    @IsUnique({model: 'user', field: 'email'})
    email: string;

    @IsString()
    @MinLength(6, {message: "Password must be at least 6 characters."})
    @IsStrongPassword()
    password: string;
}
