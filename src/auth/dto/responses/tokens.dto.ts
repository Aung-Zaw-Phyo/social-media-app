import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class TokensDto {
    @ApiProperty({example: "eyJhbGciOiJVCJ9.eyJzYy05NDkw", description: "Token for protected routes"})
    @Expose()
    accessToken: string;

    @ApiProperty({example: "eyJhbGciOiJVCJ9.eyJzYy05NDkw", description: "Token for refresh"})
    @Expose()
    refreshToken: string;
}