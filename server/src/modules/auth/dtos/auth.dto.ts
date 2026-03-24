import { StoreRole } from 'src/modules/stores/constants/store-role.constant';

export class AuthResponseDto {
  jwt: string;
}

export class JwtPayload {
  sub: string;
  username: string;
  storeId?: string;
  storeRole?: StoreRole;
}
