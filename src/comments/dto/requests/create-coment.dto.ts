import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCommentDto {
    @IsString({message: "Content is required."})
    @IsNotEmpty()
    @MaxLength(400, {message: "Content must be at most 400 characters long"})
    content: string;
}