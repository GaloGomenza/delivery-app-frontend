import { OrderStatus, PaymentType } from './OrderEnums';

export interface OrderItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  riderId: number | null;
  storeId: number;
  consumerId: number;
  products: number[];
  items: OrderItemResponse[];
  customerAddress: string;
  total: number;
  customerLatitude: number;
  customerLongitude: number;
  latitude: number;
  longitude: number;
  status: OrderStatus;
  paymentType: PaymentType;
  storeName: string;
  consumerName: string;
  riderName: string | null;
}
