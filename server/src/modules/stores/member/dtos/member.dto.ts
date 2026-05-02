import { IsNotEmpty, IsEnum, ValidateNested } from 'class-validator';
import { StoreRole } from '../../common/constants/store-role.constant';
import { Exclude, Expose, Type } from 'class-transformer';
import { AccountResponseDto, CreateAccountDto } from '@/modules/identity/dtos/account.dto';
import { ProfileSummaryDto } from '@/modules/identity/dtos/profile.dto';

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
}
