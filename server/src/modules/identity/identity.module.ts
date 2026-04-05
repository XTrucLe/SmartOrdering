import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Profile } from './entities/profile.entity';
import { AuthController } from './controllers/auth.controller';
import { AccountController } from './controllers/account.controller';
import { ProfileController } from './controllers/profile.controller';
import { AuthService } from './services/auth.service';
import { AccountService } from './services/account.service';
import { ProfileService } from './services/profile.service';
import { StoresModule } from '../stores/store.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Profile]),
    forwardRef(() => StoresModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET') || 'default_secret_key',
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') || '1h' },
      }),
    }),
  ],
  controllers: [AuthController, AccountController, ProfileController],
  providers: [AuthService, AccountService, ProfileService],
  exports: [AuthService, AccountService, ProfileService],
})
export class IdentityModule {}
