import { SectionItem } from "./items";

export type Section = {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  items: SectionItem[];
};

export type SectionForm = {
  name: string;
  description?: string;
  items?: SectionItem[];
};
