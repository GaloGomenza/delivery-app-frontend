import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../auth/service/auth-service';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../../services/store-service';
import { PageQuery, StoreSortBy } from '../../models/Pagination';
import { Store } from '../../models/Store';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  authService = inject(AuthService);
  private storeService = inject(StoreService);
  private router = inject(Router);

  stores = signal<Store[]>([]);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {

    const rol = this.authService.loggedUser()?.role;

    const query: PageQuery<StoreSortBy> = {
      page: 0,
      size: 25,
      sortBy: 'name',
      direction: 'asc',
    }

    if (rol === 'ROLE_MERCHANT') {
      const request = this.storeService.getMyStores(query, {});

      request.subscribe({
        next: (res) => {
          this.stores.set(res.content);

        },
        error: (err) => {
          console.log(err);
          this.error.set('No se pudieron cargar las tiendas');

        },
      });

    }

  }

  onNavigate(id: string): void {
    if (id) {
      this.router.navigateByUrl('/orders/store/' + id);
    }
  }


}
