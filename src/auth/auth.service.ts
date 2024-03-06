import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from './dto/auth-register.dto';
import { LoginDTO } from './dto/auth-login.dto';
import { LogoutDTO } from './dto/auth-logout.dto';

export const ACCESS_TOKEN_EXPIRE_IN = '8h';
export const REFRESH_TOKEN_EXPIRE_IN = '7d';
export const SALT_OR_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async getTokens(id: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          secret: process.env.ACCESS_TOKEN_SECRET_KEY,
          expiresIn: ACCESS_TOKEN_EXPIRE_IN,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          secret: process.env.REFRESH_TOKEN_SECRET_KEY,
          expiresIn: REFRESH_TOKEN_EXPIRE_IN,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(dto: RegisterDTO) {
    const { email, name, password } = dto;

    const userExists = await this.databaseService.getUserByEmail(email);

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hash = await bcrypt.hash(password, SALT_OR_ROUNDS);
    const newUser = { name, email, password: hash };

    const { id: userId } = await this.databaseService.createUser(newUser);
    const { refreshToken, accessToken } = await this.getTokens(userId, email);

    await this.databaseService.createRefreshToken({
      userId,
      refreshToken,
    });

    return { refreshToken, accessToken };
  }

  async login(dto: LoginDTO) {
    const { email, password } = dto;

    const user = await this.databaseService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect');
    }

    const { accessToken, refreshToken } = await this.getTokens(user.id, email);

    await this.databaseService.createRefreshToken({
      userId: user.id,
      refreshToken,
    });

    return { refreshToken, accessToken };
  }

  async refreshToken(token: string) {
    const currentRefreshToken =
      await this.databaseService.getRefreshToken(token);

    if (!currentRefreshToken) {
      throw new ForbiddenException();
    }

    const { id, email } = await this.databaseService.getUserById(
      currentRefreshToken.userId,
    );

    const { accessToken, refreshToken } = await this.getTokens(id, email);

    await this.databaseService.updateRefreshToken(token, refreshToken);

    return {
      refreshToken,
      accessToken,
    };
  }

  async logout(dto: LogoutDTO) {
    await this.databaseService.deleteRefreshToken(dto);
  }
}
