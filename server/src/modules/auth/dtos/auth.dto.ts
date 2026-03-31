import { Role } from '@/modules/accounts/constants/role.constant';
import { StoreInfo } from '@/modules/stores/dtos/stores/store-info.dto';

class AuthUser {
  id: string;
  username: string;
}

export class JwtPayload {
  sub: string;
  username: string;
  globalRole: Role;
  store?: StoreInfo;
}

export class AuthResponseDto {
  accessToken: string;
  globalRole: Role;
  user?: AuthUser;
  store?: StoreInfo[];
  activeStore?: StoreInfo;
}
