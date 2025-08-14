import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Request successful' })
    message: string;

    @ApiProperty({ example: null, nullable: true })
    error: string | null;

    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ description: 'Response data' })
    data: T;
}
