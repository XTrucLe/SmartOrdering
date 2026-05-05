import { TableStatus } from "../types";

export const TABLE_STATUS = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  RESERVED: "reserved",
  CLEANING: "cleaning",
  MAINTENANCE: "maintenance",
  DISABLED: "disabled",
} as const;

export const VALID_TABLE_STATUS_TRANSITIONS: Record<
  TableStatus,
  TableStatus[]
> = {
  [TABLE_STATUS.AVAILABLE]: [
    TABLE_STATUS.OCCUPIED,
    TABLE_STATUS.RESERVED,
    TABLE_STATUS.MAINTENANCE,
    TABLE_STATUS.DISABLED,
  ],

  [TABLE_STATUS.OCCUPIED]: [TABLE_STATUS.CLEANING, TABLE_STATUS.AVAILABLE],

  [TABLE_STATUS.RESERVED]: [
    TABLE_STATUS.OCCUPIED,
    TABLE_STATUS.AVAILABLE,
    TABLE_STATUS.CLEANING,
  ],

  [TABLE_STATUS.CLEANING]: [TABLE_STATUS.AVAILABLE],

  [TABLE_STATUS.MAINTENANCE]: [TABLE_STATUS.AVAILABLE],

  [TABLE_STATUS.DISABLED]: [TABLE_STATUS.AVAILABLE],
} as const;

export const TableStatusMap = {
  [TABLE_STATUS.AVAILABLE]: "Khả dụng",
  [TABLE_STATUS.OCCUPIED]: "Đang sử dụng",
  [TABLE_STATUS.RESERVED]: "Đã đặt trước",
  [TABLE_STATUS.CLEANING]: "Đang dọn dẹp",
  [TABLE_STATUS.MAINTENANCE]: "Đang bảo trì",
  [TABLE_STATUS.DISABLED]: "Đã vô hiệu hóa",
};

type TableStatusStyle = {
  bg: string;
  text: string;
  border: string;
};

export const TABLE_STATUS_STYLE = {
  available: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-300",
  },
  occupied: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
  },
  reserved: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
  },
  cleaning: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
  },
  maintenance: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-300",
  },
  disabled: {
    bg: "bg-gray-200",
    text: "text-gray-500",
    border: "border-gray-400",
  },
} as const satisfies Record<TableStatus, TableStatusStyle>;
