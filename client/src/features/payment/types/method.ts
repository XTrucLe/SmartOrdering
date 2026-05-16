import { PaymentMethods } from "../constants";

export type PaymentMethod =
  (typeof PaymentMethods)[keyof typeof PaymentMethods];
