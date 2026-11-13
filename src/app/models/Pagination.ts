export interface PaginationResult<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}
 
export type ProductSortBy = 'id' | 'name' | 'price' | 'status';
export type StoreSortBy = 'id' | 'name' | 'address';

export interface PageQuery<T extends string = string> {
  page: number;
  size: number;
  sortBy: T;
  direction: 'asc' | 'desc';
}