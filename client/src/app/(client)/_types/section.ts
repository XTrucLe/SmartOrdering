import { Item } from "./items";

export type Section = {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  products: Item[];
};
