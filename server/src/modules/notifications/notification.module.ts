import { Module } from '@nestjs/common';
import { OtpModule } from './otps/otp.module';

@Module({
  imports: [OtpModule],
  exports: [OtpModule],
})
export class NotificationModule {}
