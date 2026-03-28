import { Role } from '@/modules/accounts/constants/role.constant';
import { StoreRole } from '@/modules/stores/constants/store-role.constant';
class AuthUser {
  id: string;
  username: string;
  store?: StoreInfo;
}

export class StoreInfo {
  id: string;
  slug: string;
  role: StoreRole;
}
export class AuthResponseDto {
  accessToken: string;
  globalRole: Role;
  user?: AuthUser;
}

export class JwtPayload {
  sub: string;
  username: string;
  globalRole: Role;
  store?: StoreInfo;
}
