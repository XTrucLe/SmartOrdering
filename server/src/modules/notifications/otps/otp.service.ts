import { Injectable } from '@nestjs/common';

type OtpRecord = {
  code: string;
  expiresAt: Date;
};

@Injectable()
export class OtpService {
  private otpStore = new Map<string, OtpRecord>();

  private generateOtp(phoneNumber: string): OtpRecord {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
    const otpRecord: OtpRecord = { code, expiresAt };
    this.otpStore.set(phoneNumber, otpRecord);
    return otpRecord;
  }

  validateOtp(phoneNumber: string, code: string): boolean {
    const otpRecord = this.otpStore.get(phoneNumber);
    if (!otpRecord) {
      return false;
    }
    if (otpRecord.expiresAt < new Date()) {
      this.otpStore.delete(phoneNumber);
      return false;
    }
    if (otpRecord.code !== code) {
      return false;
    }
    this.otpStore.delete(phoneNumber);
    return true;
  }

  sendOtp(phoneNumber: string): boolean {
    const otp = this.generateOtp(phoneNumber);

    this.otpStore.set(phoneNumber, otp);

    console.log(`📱 OTP for ${phoneNumber}: ${otp.code}`);

    return true;
  }
}
