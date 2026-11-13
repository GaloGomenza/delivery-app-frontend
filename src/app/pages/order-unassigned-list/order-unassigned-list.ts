import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../services/order-service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
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
