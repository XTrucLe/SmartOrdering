export type SectionItem = {
  id: string;
  itemId: string;
  name: string;
  price: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  currency: string;
  unit: string;
  isAvailable: boolean;
  options?: ItemOptions[];
};

export type ItemOptions = {
  name: string;
  required: boolean;
  groupType: "single" | "multiple";
  minChoices?: number;
  maxChoices?: number;
  choices: OptionChoice[];
};

export type OptionChoice = {
  name: string;
  extraPrice: string;
};

export type SectionItemForm = {
  productId: string;
  price: number;
};
