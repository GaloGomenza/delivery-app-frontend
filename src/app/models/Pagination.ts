export interface PaginationResult<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}
 
export type ProductSortBy = 'id' | 'name' | 'price' | 'status';
 
export interface PageQuery {
  page: number;
  size: number;
  sortBy: ProductSortBy;
  direction: 'asc' | 'desc';
}