import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order-service';
import { UpdateOrderStatusRequest } from '../../models/UpdateOrderStatusRequest';
import { AuthService } from '../../auth/service/auth-service';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/Product';
import { UntypedFormBuilder } from '@angular/forms';

@Component({
    selector: 'app-order-status',
    imports: [RouterLink],
    templateUrl: './order-status.html',
    styleUrl: './order-status.css',
})
export class OrderStatusPage implements OnInit, OnDestroy {

    route = inject(ActivatedRoute);
    orderService = inject(OrderService);
    authService = inject(AuthService);
    productService = inject(ProductService);

    orderId: number = 0;
    refreshId: number | null = null;

    productsInOrder = signal<Product[]>([]);



    steps: string[] = ['PENDING', 'CONFIRMED', 'CONFIRMED_ASSIGNED', 'DISPATCHED', 'COMPLETED'];

    ngOnInit(): void {
        this.orderService.order.set(null);

        this.orderId = Number(this.route.snapshot.params['id']);

        if (isNaN(this.orderId) || this.orderId <= 0) {
            this.orderService.error.set('El ID del pedido no es válido.');
            return;
        }

        this.orderService.getOrderById(this.orderId);
        this.getProductsInOrder();

        this.refreshId = window.setInterval(() => {
            this.orderService.getOrderById(this.orderId);
            if (this.productsInOrder().length == 0) {
                this.getProductsInOrder();
            }

        }, 5000);
    }

    ngOnDestroy(): void {
        if (this.refreshId != null)
            window.clearInterval(this.refreshId);
    }

    getRutaVolver(): (string | number)[] {
        const role = this.authService.loggedUser()?.role;
        const order = this.orderService.order();

        if (role === 'ROLE_MERCHANT') {
          return order?.storeId ? ['/orders/store', order.storeId] : ['/store/list'];
        }
    
        if (role === 'ROLE_RIDER') {
          return order?.status === 'PENDING'
            ? ['/orders/unassigned']
            : ['/orders/my-orders'];
        }
    
        return ['/orders/my-orders'];
    }

    isStepDone(step: string): boolean {
        let order = this.orderService.order();

        if (order == null)
            return false;

        else if (order.status == 'CANCELLED')
            return step == 'PENDING';

        return this.steps.indexOf(step) <= this.steps.indexOf(order.status);
    }

    isStepCurrent(step: string): boolean {
        return this.orderService.order()?.status == step;
    }

    getStatusLabel(): string {
        let order = this.orderService.order();

        if (order == null)
            return '';

        return this.getStepLabel(order.status);
    }

    getStatusMessage(): string {
        let order = this.orderService.order();

        if (order == null)
            return '';

        switch (order.status) {
            case 'PENDING':
                if (this.authService.loggedUser()?.role === 'ROLE_MERCHANT') {
                    return '¡Nuevo pedido! Acéptelo o rechácelo.'
                } else {
                    return 'Tu pedido está pendiente de confirmación.';
                }

            case 'CONFIRMED':
                if (this.authService.loggedUser()?.role === 'ROLE_MERCHANT') {
                    return 'Confirmaste el pedido. Buscando repartidor...'
                } else if (this.authService.loggedUser()?.role === 'ROLE_RIDER'){
                    return 'Pedido buscando repartidor. ¿Desea tomarlo?';
                } else{
                    return 'El comercio confirmó tu pedido y está en preparación. Esperando que un repartidor lo tome...';
                }

            case 'CONFIRMED_ASSIGNED':
                if (this.authService.loggedUser()?.role === 'ROLE_MERCHANT') {
                    return 'Un repartidor ha tomado el pedido. Entregáselo cuando esté listo.';
                } else if (this.authService.loggedUser()?.role === 'ROLE_RIDER'){
                    return 'Dirígete al comercio. Te entregarán el pedido cuando esté listo';
                } else{
                    return 'Tu pedido está en preparacion. El repartidor lo está esperando.';
                }

            case 'DISPATCHED':
                if (this.authService.loggedUser()?.role === 'ROLE_MERCHANT') {
                    return 'Esperando que el repartidor entregue el pedido...';
                } else if (this.authService.loggedUser()?.role === 'ROLE_RIDER'){
                    return 'Recibiste el pedido. Entregalo en el domicilio del cliente.';
                } else{
                    return '¡Tu pedido está en camino! Por favor confirmá cuando llegue.';
                }

            case 'COMPLETED':
                if (this.authService.loggedUser()?.role === 'ROLE_MERCHANT') {
                    return '¡El cliente ha recibido el pedido!';
                } else if (this.authService.loggedUser()?.role === 'ROLE_RIDER'){
                    return '¡El cliente confirmó que le has entregado el pedido!';
                } else{
                    return 'Has recibido tu pedido. ¡A disfrutar!';
                }

            case 'CANCELLED':
                if (this.authService.loggedUser()?.role === 'ROLE_MERCHANT') {
                    return 'Has cancelado el pedido.';
                } else{
                    return 'El pedido fue rechazado por el comercio.';
                }

            default:
                return '';
        }
    }

    getPaymentLabel(): string {
        let order = this.orderService.order();

        if (order == null)
            return '';

        switch (order.paymentType) {
            case 'EFECTIVO':
                return 'Efectivo';
            case 'TRANSFERENCIA':
                return 'Transferencia';
            case 'PAGODIGITAL':
                return 'Pago digital';
            default:
                return order.paymentType;
        }
    }

    getStepLabel(step: string): string {
        switch (step) {
            case 'PENDING':
                return 'Pendiente';
            case 'CONFIRMED':
                return 'Confirmado';
            case 'CONFIRMED_ASSIGNED':
                return 'Repartidor asignado';
            case 'DISPATCHED':
                return 'En camino';
            case 'COMPLETED':
                return 'Entregado';
            case 'CANCELLED':
                return 'Cancelado';
            default:
                return step;
        }
    }

    confirmOrder(orderId: number | undefined) {
        const updateOrderStatusRequest: UpdateOrderStatusRequest = { status: 'CONFIRMED' };
        if (orderId) {
            this.orderService.updateOrderStatus(orderId, updateOrderStatusRequest);
        }
    }

    cancelOrder(orderId: number | undefined) {
        const updateOrderStatusRequest: UpdateOrderStatusRequest = { status: 'CANCELLED' };
        if (orderId) {
            this.orderService.updateOrderStatus(orderId, updateOrderStatusRequest);
        }
    }

    dispatchOrder(orderId: number | undefined) {
        const updateOrderStatusRequest: UpdateOrderStatusRequest = { status: 'DISPATCHED' };
        if (orderId) {
            this.orderService.updateOrderStatus(orderId, updateOrderStatusRequest);
        }
    }

    completeOrder(orderId: number | undefined) {
        const updateOrderStatusRequest: UpdateOrderStatusRequest = { status: 'COMPLETED' };
        if (orderId) {
            this.orderService.updateOrderStatus(orderId, updateOrderStatusRequest);
        }
    }

    getProductsInOrder() {

        const productsIdsFromOrder = this.orderService.order()?.products;
        const productList: Product[] = [];
        if (productsIdsFromOrder != undefined) {
            for (let index = 0; index < productsIdsFromOrder.length; index++) {
                const productId = productsIdsFromOrder[index];

                this.productService.getProduct(productId).subscribe({
                    next: (p) => {
                        productList.push(p);
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });

            }
            this.productsInOrder.set(productList);
        }

    }
}
