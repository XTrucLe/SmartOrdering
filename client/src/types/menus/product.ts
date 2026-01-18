export type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
};

export type SelectedProduct = Product & {
  quantity: number;
};
