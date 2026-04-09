export interface Pages<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
