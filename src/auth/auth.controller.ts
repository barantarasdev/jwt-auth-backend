import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/auth-login.dto';
import { RegisterDTO } from './dto/auth-register.dto';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard';
import { LogoutDTO } from './dto/auth-logout.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/test')
  async test() {
    return { success: 'success' };
  }

  @UsePipes(new ValidationPipe())
  @Post('/register')
  async register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }

  @Post('/login')
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  async refreshToken(@Req() req: Request) {
    return this.authService.refreshToken(req.user['refreshToken']);
  }

  @Post('/logout')
  async logout(@Body() dto: LogoutDTO) {
    return this.authService.logout(dto);
  }
}
