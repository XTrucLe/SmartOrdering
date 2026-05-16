export type DeliveryInfo = {
  address: string;
  receiverName: string;
  receiverPhone: string;

  ward?: string;
  district?: string;
  city?: string;

  note?: string;
};
