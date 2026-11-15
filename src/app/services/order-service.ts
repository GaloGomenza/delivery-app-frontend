import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { OrderResponse } from '../models/OrderResponse';
import { UpdateOrderStatusRequest } from '../models/UpdateOrderStatusRequest';
import { Router } from '@angular/router';
import { PageQuery, PaginationResult } from '../models/Pagination';
import { Observable } from 'rxjs';
import { Order } from '../models/Order';
import { CreateOrderRequest } from '../models/CreateOrderRequest';

export interface OrderFilter {
  status?: string;
}



@Injectable({
    providedIn: 'root',
})
export class OrderService {

    http: HttpClient = inject(HttpClient);

    url: string = 'api/v1/orders';
    private router = inject(Router);

    order = signal<OrderResponse | null>(null);
    orders = signal<OrderResponse[]>([]);
    error = signal<string>('');

    getOrderById(id: number) {
        this.error.set('');

        this.http.get<OrderResponse>(this.url + '/' + id).subscribe({
            next: (data) => {
                this.order.set(data);
            },
            error: (err) => {
                this.order.set(null);
                this.error.set(this.getErrorMessage(err.status));
            }
        });
    }

    getMyOrders() {
        this.http.get<OrderResponse[]>(this.url + '/my-orders').subscribe({
            next: (data) => {
                this.orders.set(data);
            },
            error: () => {
                this.error.set('No se pudieron cargar los pedidos');
            }
        });
    }

    getErrorMessage(status: number) {
        switch (status) {
            case 404:
                return 'Pedido no encontrado.';
            case 403:
                return 'No tenés permisos para ver este pedido.';
            case 401:
                return 'Tu sesión expiró. Volvé a iniciar sesión.';
            default:
                return 'No pudimos obtener el pedido. Intentá nuevamente.';
        }
    }

    getUnassignedOrders() {
        this.http.get<OrderResponse[]>(this.url + '/unassigned').subscribe({
            next: (data) => {
                this.orders.set(data);
            },
            error: () => {
                this.error.set('No se pudieron cargar los pedidos');
            }
        });
    }

    updateOrderStatus(orderId: number, body: UpdateOrderStatusRequest) {
        this.http.patch<OrderResponse>(this.url + '/' + orderId + '/status', body).subscribe({

            next: (data) => {
                this.router.navigate(['/orders/' + orderId], { replaceUrl: true });

            },
            error: () => {
                this.error.set('Error asignando pedidos');
            }

        });
    }


    getOrdersByStore(query: PageQuery, filter: OrderFilter, storeId: number): Observable<PaginationResult<Order>> {

        let params = new HttpParams()
            .set('page', query.page)
            .set('size', query.size)
            .set('sortBy', query.sortBy)
            .set('direction', query.direction);

        if (filter.status?.trim()) params = params.set('status', filter.status.trim());
       
        return this.http.get<PaginationResult<Order>>(this.url + '/store/' + storeId, { params });

    }

    createOrder(body: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.url, body);
}
}
