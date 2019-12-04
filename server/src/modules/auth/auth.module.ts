import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import * as appConstants from '../../common/constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
        secret: appConstants.JWT_SECRET,
        signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
