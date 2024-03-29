import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot(), AuthModule],
  controllers: [],
  providers: [DatabaseService],
})
export class AppModule {}
