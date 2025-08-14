import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({example: "eyJhbGciOiJVCJ9.eyJzYy05NDkw", description: "Token for refresh"})
  @IsString()
  refreshToken: string;
}