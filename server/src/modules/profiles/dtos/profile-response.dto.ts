import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProfileResponseDto {
  @Expose() id: number;
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose() gender: string;
  @Expose() phoneNumber: string;
  @Expose() email: string;
  @Expose() dateOfBirth: Date;
  @Expose() avatar: string;
  @Expose() type: string;
  @Expose() streetAddress: string;
  @Expose() ward: string;
  @Expose() province: string;
  @Expose() createdAt: Date;
}

@Exclude()
export class ProfileSummaryDto {
  @Expose() id: string;
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose() avatar: string;
}
