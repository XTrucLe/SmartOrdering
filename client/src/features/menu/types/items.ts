export type Item = {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  unit: string;
  isAvailable: boolean;
};


export type ItemForm = {
  productId: string;
  price: number;
}