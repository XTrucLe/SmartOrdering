export enum StoreStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export const StatusNextAction = {
  [StoreStatus.PENDING]: ['ACTIVE', 'REJECTED'],
  [StoreStatus.ACTIVE]: ['SUSPENDED'],
  [StoreStatus.REJECTED]: ['ACTIVE'],
  [StoreStatus.SUSPENDED]: ['ACTIVE'],
};
