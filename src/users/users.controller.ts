import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dto/responses/user.dto';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/common/decorators/api-response.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/me')
    @ApiOperation({summary: "Get current user profile"})
    @ApiBearerAuth()
    @ApiSuccessResponse('Current user', 200, UserDto)
    @ApiErrorResponse('Unauthenticated', 401, 'Unauthenticated')
    @UseGuards(AuthGuard)
    @Serialize({dto: UserDto, message: 'Current user'})
    profile(@Req() req) {
        return req.user;
    }
}
