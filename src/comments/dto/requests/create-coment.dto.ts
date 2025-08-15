import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({example: "Nice comment", description: "The content of comment"})
    @IsString({message: "Content is required."})
    @IsNotEmpty()
    @MaxLength(400, {message: "Content must be at most 400 characters long"})
    content: string;
}