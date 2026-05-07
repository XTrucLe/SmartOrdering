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
  dotbg?: string;
};

export const TABLE_STATUS_STYLE = {
  available: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-300",
    dotbg: "bg-green-500",
  },
  occupied: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
    dotbg: "bg-red-500",
  },
  reserved: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
    dotbg: "bg-amber-500",
  },
  cleaning: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
    dotbg: "bg-blue-500",
  },
  maintenance: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-300",
    dotbg: "bg-purple-500",
  },
  disabled: {
    bg: "bg-gray-200",
    text: "text-gray-500",
    border: "border-gray-400",
    dotbg: "bg-gray-300",
  },
} as const satisfies Record<TableStatus, TableStatusStyle>;
