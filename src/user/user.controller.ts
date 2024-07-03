import { UserInfo } from 'src/utils/userInfo.decorator';

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoginDto } from './dto/login.dto';
import { SigninDto } from './dto/signin.dto';
import { User } from './entities/user.entitiy';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() loginDto: LoginDto) {
    return await this.userService.register(loginDto.email, loginDto.password, loginDto.nickname);
  }

  @Post('login')
  async login(@Body() signinDto: SigninDto ) {
    return await this.userService.login(signinDto.email, signinDto.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('email')
  getEmail(@UserInfo() user: User) {
    return { email: user.email, nickname: user.nickname, point:user.point };
  }
}