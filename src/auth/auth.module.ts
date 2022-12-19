import { Global, Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './providers/jwt.strategy';
import { LocalStrategy } from './providers/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '196h' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
