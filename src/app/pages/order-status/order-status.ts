import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order-service';

@Component({
    selector: 'app-order-status',
    imports: [],
    templateUrl: './order-status.html',
    styleUrl: './order-status.css',
})
export class OrderStatusPage implements OnInit, OnDestroy {

    route = inject(ActivatedRoute);
    orderService = inject(OrderService);

    orderId: number = 0;
    refreshId: number | null = null;

    steps: string[] = ['PENDING', 'CONFIRMED', 'CONFIRMED_ASSIGNED', 'DISPATCHED', 'COMPLETED'];

    ngOnInit(): void
    {
        this.orderService.order.set(null);

        this.orderId = Number(this.route.snapshot.params['id']);

        if (isNaN(this.orderId) || this.orderId <= 0) {
            this.orderService.error.set('El ID del pedido no es válido.');
            return;
        }

        this.orderService.getOrderById(this.orderId);

        this.refreshId = window.setInterval(() => {
            this.orderService.getOrderById(this.orderId);
        }, 10000);
    }

    ngOnDestroy():void
    {
        if (this.refreshId != null)
            window.clearInterval(this.refreshId);
    }

    actualizar():void {
        this.orderService.getOrderById(this.orderId);
    }

    isStepDone(step: string):boolean
    {
        let order = this.orderService.order();

        if (order == null)
            return false;

        else if (order.status == 'CANCELLED')
            return step == 'PENDING';

        return this.steps.indexOf(step) <= this.steps.indexOf(order.status);
    }

    isStepCurrent(step: string):boolean {
        return this.orderService.order()?.status == step;
    }

    getStatusLabel():string {
        let order = this.orderService.order();

        if (order == null)
            return '';

        return this.getStepLabel(order.status);
    }

    getStatusMessage():string {
        let order = this.orderService.order();

        if (order == null)
            return '';

        switch (order.status)
        {
            case 'PENDING':
                return 'Tu pedido está pendiente de confirmación por el comercio.';
            case 'CONFIRMED':
                return 'El comercio aceptó tu pedido. Esperando que un repartidor lo tome.';
            case 'CONFIRMED_ASSIGNED':
                return 'Un repartidor tomó tu pedido.';
            case 'DISPATCHED':
                return 'Tu pedido está en camino.';
            case 'COMPLETED':
                return 'Tu pedido fue entregado.';
            case 'CANCELLED':
                return 'El pedido fue cancelado.';
            default:
                return '';
        }
    }

    getPaymentLabel():string
    {
        let order = this.orderService.order();

        if (order == null)
            return '';

        switch (order.paymentType)
        {
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

    getStepLabel(step:string):string
    {
        switch (step)
        {
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
}
