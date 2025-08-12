import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/requests/register.dto';
import { LoginDto } from './dto/requests/login.dto';
import { UsersService } from './../users/users.service';
import { throwCustomError } from 'src/common/helper';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(data: RegisterDto) {
        return this.usersService.createUser(data);
    }

    async login(data: LoginDto) {
        const user = await this.usersService.getUser({email: data.email});
        if(!(await bcrypt.compare(data.password, user.password))) {
            throwCustomError('Your credentials are incorrect!');
        }
        const access_token = await this.jwtService.sign({userId: user.id, userEmail: user.email});
        return { access_token };
    }
}
