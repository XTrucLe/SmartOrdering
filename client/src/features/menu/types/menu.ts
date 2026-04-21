import type { Section } from "./section";

export type Menu = {
  id: string;
  name: string;
  type: MenuType;
  description?: string;
  displayOrder: number;
  sections: Section[];
};


export type MenuType = "MAIN" | "SPECIALS" | "SEASONAL";

export type MenuForm = {
  name: string;
  type: MenuType;
  description?: string;
  displayOrder: number;
  sections?: Section[];
};