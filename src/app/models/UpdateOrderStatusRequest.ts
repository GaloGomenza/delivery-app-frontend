import { OrderStatus } from "./OrderEnums";

export interface UpdateOrderStatusRequest {
    status: OrderStatus
}