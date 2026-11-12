export type ProductStatus = 'AVAILABLE' | 'UNAVAILABLE';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageURL: string | null;
  status: ProductStatus;
  storeId: number;
}

export type ProductRequest = Omit<Product, 'id'>;