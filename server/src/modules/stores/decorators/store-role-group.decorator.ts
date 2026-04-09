import { StoreRoles } from './store-role.decorator';
import { StoreRole } from '../constants/store-role.constant';

const StoreStaff = () => StoreRoles(StoreRole.OWNER, StoreRole.MANAGER, StoreRole.STAFF);
const StoreManager = () => StoreRoles(StoreRole.OWNER, StoreRole.MANAGER);
const StoreOwner = () => StoreRoles(StoreRole.OWNER);

export { StoreManager, StoreOwner, StoreStaff };
