import { OrderStatus, PaymentType } from './OrderEnums';

export interface OrderResponse {
    id: number;
    riderId: number | null;
    storeId: number;
    consumerId: number;
    products: number[];
    customerAddress: string;
    total: number;
    customerLatitude: number;
    customerLongitude: number;
    latitude: number;
    longitude: number;
    status: OrderStatus;
    paymentType: PaymentType;
}
