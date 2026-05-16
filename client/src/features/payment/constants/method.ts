import { Banknote, CreditCard, QrCode, Wallet } from "lucide-react";
import { PaymentMethod } from "../types";

export const PaymentMethods = {
  CASH: "CASH",
  CARD: "CARD",
  QR: "QR",
  EWALLET: "EWALLET",
} as const;

export const PAYMENT_METHODS: Record<
  PaymentMethod,
  {
    value: PaymentMethod;
    label: string;
    icon: React.ElementType;
    disabled?: boolean;
  }
> = {
  CASH: {
    value: PaymentMethods.CASH,
    label: "Cash",
    icon: Banknote,
  },

  CARD: {
    value: PaymentMethods.CARD,
    label: "Card",
    icon: CreditCard,
    disabled: true, // Marking card payment as disabled for now
  },

  QR: {
    value: PaymentMethods.QR,
    label: "QR Payment",
    icon: QrCode,
  },

  EWALLET: {
    value: PaymentMethods.EWALLET,
    label: "E-Wallet",
    icon: Wallet,
    disabled: true, // Marking e-wallet payment as disabled for now
  },
};
