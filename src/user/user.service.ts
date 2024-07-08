import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { QueryRunner, Repository } from 'typeorm';

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entitiy'
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async deductBalance(user: User, price: number, queryRunner: QueryRunner) {
      const finalpoint = user.point - price
      const newuserpoint = this.userRepository.merge(user, {point:finalpoint})
      await queryRunner.manager.save(newuserpoint)
      return
  }

  async register(loginDto:LoginDto) {
    const {email, password, nickname, role} = loginDto
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입된 사용자가 있습니다!',
      );
    }

    const existingNickname = await this.userRepository.findOneBy(nickname);
    if(existingNickname){
      throw new ConflictException('사용중인 닉네임 입니다.')
    }

    const hashedPassword = await hash(password, 10);
    await this.userRepository.save({
      email,
      password: hashedPassword,
      nickname,
      role,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password','role'],
      where: { email },
    });
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}