import { Exclude, Expose } from 'class-transformer';
import { StoreRole } from '../../common/constants/store-role.constant';

@Exclude()
export class StoreContextDto {
  @Expose() id: string;
  @Expose() slug: string;
  @Expose() role: StoreRole;
}
