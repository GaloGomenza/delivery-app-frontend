import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../services/order-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Order } from '../../models/Order';
import { AuthService } from '../../auth/service/auth-service';
import { OrderSortBy, PageQuery } from '../../models/Pagination';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-order-store-list',
  styleUrl: './order-store-list.css',
  templateUrl: './order-store-list.html',
})
export class OrderStoreList implements OnInit {

  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  storeId = Number(this.route.snapshot.params['storeId']);

  orders = signal<Order[]>([]);
  esComerciante = computed(() => this.authService.loggedUser()?.role === 'ROLE_MERCHANT');

  page = signal(0);
  size = signal(10);
  sortBy = signal<OrderSortBy>('id');
  direction = signal<'asc' | 'desc'>('asc');
  search = signal('');
  totalPages = signal(0);
  totalElements = signal(0);

  loading = signal(false);
  error = signal<string | null>(null);
  private timer?: ReturnType<typeof setTimeout>;


  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.error.set(null);

    const query: PageQuery<OrderSortBy> = {
      page: this.page(),
      size: this.size(),
      sortBy: this.sortBy(),
      direction: this.direction(),
    };

    const rol = this.authService.loggedUser()?.role;

    const request = this.orderService.getOrdersByStore(query, { status: this.search() }, this.storeId);

    request.subscribe({
      next: (res) => {
        this.orders.set(res.content);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements);
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.error.set('No se pudieron cargar las ordenes');
        this.loading.set(false);
      },
    });
  }


    ordenar(col: OrderSortBy): void {
      if (this.sortBy() === col) {
        this.direction.update((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        this.sortBy.set(col);
        this.direction.set('asc');
      }
      this.page.set(0);
      this.cargar();
    }
  
    flecha(col: OrderSortBy): string {
      if (this.sortBy() !== col) return '';
      return this.direction() === 'asc' ? ' ↑' : ' ↓';
    }
  
    irAPagina(p: number): void {
      this.page.set(p);
      this.cargar();
    }


}
