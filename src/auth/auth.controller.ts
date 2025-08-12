import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/requests/register.dto';
import { LoginDto } from './dto/requests/login.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('/register')
    @Serialize({message: 'Successfully register.'})
    register(@Body() registerDto: RegisterDto) {
        this.authService.register(registerDto);
    }

    @Post('/login')
    @Serialize({message: 'Successfully login.'})
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }
}
