import { PaymentType } from './OrderEnums';

export interface CreateOrderRequest {
  customerAddress?: string;
  paymentType: PaymentType;
  items: {
    productId: number;
    quantity: number;
  }[];
}