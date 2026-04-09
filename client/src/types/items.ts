export type Item = {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  unit: string;
};

export type OrderedItem = Item & {
  quantity: number;
};
