import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { LoginDto } from './auth.dto';
@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>, private readonly jwt: JwtService) {}
  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.users.findOneBy({ email: dto.email });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) throw new UnauthorizedException('Invalid credentials');
    return { access_token: this.jwt.sign({ sub: user.id, email: user.email }) };
  }
}
