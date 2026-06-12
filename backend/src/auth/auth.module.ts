import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { OptionalJwtGuard } from './optional-jwt.guard';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]), PassportModule,
    JwtModule.registerAsync({ imports: [ConfigModule], inject: [ConfigService],
      useFactory: (c: ConfigService) => ({ secret: c.get<string>('JWT_SECRET', 'change-me-in-production'), signOptions: { expiresIn: '7d' } }) }),
  ],
  providers: [AuthService, JwtStrategy, OptionalJwtGuard],
  controllers: [AuthController],
  exports: [JwtModule, OptionalJwtGuard],
})
export class AuthModule {}
