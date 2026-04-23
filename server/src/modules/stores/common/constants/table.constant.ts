export enum TableStatus {
  AVAILABLE = 'available', //Khả dụng
  OCCUPIED = 'occupied', //Đang sử dụng
  RESERVED = 'reserved', //Đã đặt trước
  CLEANING = 'cleaning', //Đang dọn dẹp
  MAINTENANCE = 'maintenance', //Bảo trì
  DISABLED = 'disabled', //Vô hiệu hóa
}

export const ValidTableStatusTransitions: Record<TableStatus, TableStatus[]> = {
  [TableStatus.AVAILABLE]: [
    TableStatus.OCCUPIED,
    TableStatus.RESERVED,
    TableStatus.MAINTENANCE,
    TableStatus.DISABLED,
  ],
  [TableStatus.OCCUPIED]: [TableStatus.CLEANING],
  [TableStatus.RESERVED]: [TableStatus.OCCUPIED, TableStatus.AVAILABLE],
  [TableStatus.CLEANING]: [TableStatus.AVAILABLE],
  [TableStatus.MAINTENANCE]: [TableStatus.AVAILABLE],
  [TableStatus.DISABLED]: [TableStatus.AVAILABLE],
};
