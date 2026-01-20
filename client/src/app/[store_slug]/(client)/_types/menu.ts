import type { Section } from "./section";

export type Menu = {
  id: string;
  name: string;
  type: string;
  description?: string;
  displayOrder: number;
  sections: Section[];
};
