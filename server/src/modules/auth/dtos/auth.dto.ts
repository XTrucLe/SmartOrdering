import { Role } from 'src/modules/accounts/constants/role.constant';

export class AuthResponseDto {
  jwt: string;
  role: Role;
}

export class JwtPayload {
  sub: string;
  username: string;
  role: Role;
}
