import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/requests/register.dto';
import { LoginDto } from './dto/requests/login.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { RefreshTokenDto } from './dto/requests/refresh-token.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/common/decorators/api-response.decorator';
import { TokensDto } from './dto/responses/tokens.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('/register')
    @ApiOperation({summary: "User register"})
    @ApiSuccessResponse('Register successfully.', 201)
    @ApiErrorResponse(['username already exists in users'], 400, "Bad request")
    @Serialize({message: 'Register successfully.'})
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('/login')
    @ApiOperation({summary: "User login"})
    @ApiSuccessResponse('Login successfully.', 201, TokensDto)
    @ApiErrorResponse("Your credentials are incorrect!!", 401, "Unauthorized")
    @Serialize({dto: TokensDto, message: 'Login successfully.'})
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    @Post('/logout')
    @ApiOperation({summary: "User logout"})
    @ApiSuccessResponse('Logout successfully.', 201)
    @Serialize({message: "Logout successfully."})
    logout(@Body() dto: RefreshTokenDto) {
        return this.authService.logout(dto.refreshToken);
    }

    @Post('/refresh')
    @ApiOperation({summary: "Token refresh"})
    @ApiSuccessResponse('Token refresh.', 201)
    @ApiErrorResponse('Invalid refresh token', 403, 'Forbidden')
    @ApiErrorResponse("Refresh token expired", 403, "Forbidden")
    @Serialize({dto: TokensDto, message: "Token refresh."})
    refresh(@Body() data: RefreshTokenDto) {
        return this.authService.refreshTokens(data);
    }
}
