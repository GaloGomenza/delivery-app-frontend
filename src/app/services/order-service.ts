import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { OrderResponse } from '../models/OrderResponse';
import { UpdateOrderStatusRequest } from '../models/UpdateOrderStatusRequest';
import { Router } from '@angular/router';

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

    getOrderById(id: number)
    {
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

    getMyOrders()
    {
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
        switch (status)
        {
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

    getUnassignedOrders(){
        this.http.get<OrderResponse[]>(this.url + '/unassigned').subscribe({
            next: (data) => {
                this.orders.set(data);
            },
            error: () => {
                this.error.set('No se pudieron cargar los pedidos');
            }
        });
    }

    updateOrderStatus(orderId: number, body: UpdateOrderStatusRequest ){
        this.http.patch<OrderResponse>(this.url + '/' + orderId + '/status', body).subscribe({

            next: (data) => {
                this.router.navigate(['/orders/' + orderId], { replaceUrl: true });
                
            },
            error: () => {
                this.error.set('Error asignando pedidos');
            }

        });
    }

}
