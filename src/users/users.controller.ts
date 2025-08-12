import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/me')
    @UseGuards(AuthGuard)
    profile(@Req() req) {
        return req.user;
    }
}
