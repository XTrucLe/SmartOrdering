import { Role } from '@/modules/accounts/constants/role.constant';
import { StoreRole } from '@/modules/stores/constants/store-role.constant';

class AuthUser {
  id: string;
  username: string;
}

export class StoreInfo {
  id: string;
  slug: string;
  role: StoreRole;
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
