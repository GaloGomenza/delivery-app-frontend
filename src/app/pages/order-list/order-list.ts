import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../services/order-service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-order-list',
  styleUrl: './order-list.css',
  templateUrl: './order-list.html',
})
export class OrderList implements OnInit{
  
  orderService = inject(OrderService);

  ngOnInit(): void {
    this.orderService.getMyOrders();
  }

}
