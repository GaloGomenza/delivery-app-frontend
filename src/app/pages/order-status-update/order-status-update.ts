import { UpdateOrderStatusRequest } from './../../models/UpdateOrderStatusRequest';
import { Component, inject } from '@angular/core';
import { OrderService } from '../../services/order-service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/service/auth-service';

@Component({
  imports: [],
  selector: 'app-order-status-update',
  styleUrl: './order-status-update.css',
  templateUrl: './order-status-update.html',
})
export class OrderStatusUpdate {

  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  authService = inject(AuthService);

  orderId = Number(this.route.snapshot.params['id']);
  esRepartidor = this.authService.loggedUser()?.role === 'ROLE_RIDER';

  ngOnInit(): void {

    const updateOrderStatusRequest: UpdateOrderStatusRequest = { status: 'CONFIRMED_ASSIGNED'};
    if(this.esRepartidor){
      this.orderService.updateOrderStatus(this.orderId, updateOrderStatusRequest);
    }
    
  }



}
