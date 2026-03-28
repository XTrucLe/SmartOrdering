import { IsNotEmpty } from 'class-validator';
import { CreateAccountDto } from '@/modules/accounts/dtos/account.dto';
import { CreateStoreDto } from '@/modules/stores/dtos/stores/create-store.dto';

export class OwnerRegisterDto extends CreateAccountDto {
  @IsNotEmpty()
  store: CreateStoreDto;
}
