import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../services/order-service';

@Component({
  imports: [],
  selector: 'app-order-unassigned-list',
  styleUrl: './order-unassigned-list.css',
  templateUrl: './order-unassigned-list.html',
})
export class OrderUnassignedList implements OnInit{

  orderService = inject(OrderService);

  ngOnInit(): void {
    this.orderService.getUnassignedOrders();
  }


}
