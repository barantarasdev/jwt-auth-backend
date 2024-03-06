import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Token } from '@prisma/client';
import { LogoutDTO } from 'src/auth/dto/auth-logout.dto';
import { RegisterDTO } from 'src/auth/dto/auth-register.dto';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  //user

  async getUserByEmail(email: string) {
    return await this.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getUserById(id: string) {
    return await this.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createUser(dto: RegisterDTO) {
    return await this.user.create({ data: dto });
  }

  //token

  async getRefreshToken(refreshToken: string) {
    return await this.token.findUnique({
      where: {
        refreshToken,
      },
    });
  }

  async createRefreshToken(dto: Omit<Token, 'id'>) {
    return await this.token.create({ data: dto });
  }

  async updateRefreshToken(oldRefreshToken: string, newRefreshToken: string) {
    return await this.token.update({
      where: {
        refreshToken: oldRefreshToken,
      },
      data: {
        refreshToken: newRefreshToken,
      },
    });
  }

  async deleteRefreshToken(dto: LogoutDTO) {
    return await this.token.delete({
      where: { refreshToken: dto.refreshToken },
    });
  }
}
