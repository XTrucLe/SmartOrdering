import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountModule } from '../accounts/account.module';
import { ProfileModule } from '../profiles/profile.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { OtpModule } from '../notifications/otps/otp.module';

@Global()
@Module({
  imports: [
    AccountModule,
    OtpModule,
    ProfileModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
