import { IsNotEmpty, IsEnum } from 'class-validator';
import { StoreRole } from '../../constants/store-role.constant';
import { PartialType } from '@nestjs/mapped-types';
import {
  AccountResponseDto,
  CreateAccountDto,
} from '@/modules/accounts/dtos/account.dto';
import { ProfileSummaryDto } from '@/modules/profiles/dtos/profile-response.dto';
import { Exclude, Expose } from 'class-transformer';

export class CreateStoreMemberDto {
  @IsNotEmpty()
  @IsEnum(StoreRole)
  role: StoreRole;

  @IsNotEmpty()
  newStaff: CreateAccountDto;
}

export class UpdateStoreMemberDto extends PartialType(CreateStoreMemberDto) {}

@Exclude()
export class StoreMemberResponseDto {
  @Expose() id: string;
  @Expose() role: StoreRole;
  @Expose() user: AccountResponseDto;
  @Expose() profile: ProfileSummaryDto;
}
