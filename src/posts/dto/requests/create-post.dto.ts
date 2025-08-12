import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreatePostDto {
    @IsString({message: "Content is required."})
    @IsNotEmpty()
    @MaxLength(500, {message: "Content must be at most 500 characters long"})
    content: string;

    @IsOptional()
    imageUrl: string;
}
