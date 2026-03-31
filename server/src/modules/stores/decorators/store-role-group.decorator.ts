import { StoreRoles } from './store-role.decorator';
import { StoreRole } from '../constants/store-role.constant';

const StoreManager = () => StoreRoles(StoreRole.OWNER, StoreRole.MANAGER);
const StoreOwner = () => StoreRoles(StoreRole.OWNER);

export { StoreManager, StoreOwner };
