import { PaymentType } from './OrderEnums';

export interface CreateOrderRequest {
  customerAddress?: string;
  customerLatitude: number;
  customerLongitude: number;
  paymentType: PaymentType;
  items: {
    productId: number;
    quantity: number;
  }[];
}