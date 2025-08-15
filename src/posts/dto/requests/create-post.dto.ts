import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreatePostDto {
    @ApiProperty({example: "Nice post", description: "The content of post"})
    @IsString({message: "Content is required."})
    @IsNotEmpty()
    @MaxLength(500, {message: "Content must be at most 500 characters long"})
    content: string;

    @ApiProperty({example: "image.jpg", description: "The image of post"})
    @IsOptional()
    imageUrl: string;
}
