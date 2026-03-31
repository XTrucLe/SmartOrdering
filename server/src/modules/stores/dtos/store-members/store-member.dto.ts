import { IsNotEmpty, IsEnum, ValidateNested } from 'class-validator';
import { StoreRole } from '../../constants/store-role.constant';
import {
  AccountResponseDto,
  CreateAccountDto,
} from '@/modules/accounts/dtos/account.dto';
import { ProfileSummaryDto } from '@/modules/profiles/dtos/profile-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

export class CreateStoreMemberDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateAccountDto)
  account: CreateAccountDto;
}

export class UpdateStoreMemberDto {
  @IsNotEmpty()
  @IsEnum(StoreRole)
  role: StoreRole;
}

@Exclude()
export class StoreMemberResponseDto {
  @Expose() id: string;
  @Expose() role: StoreRole;
  @Expose() user: AccountResponseDto;
  @Expose() email: string;
  @Expose()
  @Type(() => ProfileSummaryDto)
  profile: ProfileSummaryDto;
}
