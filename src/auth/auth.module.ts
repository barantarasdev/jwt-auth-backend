import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseService } from 'src/database/database.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  providers: [
    AuthService,
    DatabaseService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  imports: [PassportModule, JwtModule.register({})],
  controllers: [AuthController],
})
export class AuthModule {}
