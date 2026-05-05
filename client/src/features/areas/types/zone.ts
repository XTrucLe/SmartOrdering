export interface Zone {
  id: string;
  name: string;
  createdAt?: string;
}

export type ZoneCreate = {
  name: string;
  description: string;
};
