import { Product } from "./product";

export type Section = {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  products: Product[];
};
