import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/service/auth-service';
import { PageQuery, StoreSortBy } from '../../models/Pagination';
import { Store } from '../../models/Store';
import { Ubicacion_provisoria } from '../../models/Ubicacion-provisoria';
import { StoreService } from '../../services/store-service';

@Component({
  selector: 'app-store-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './store-list.html',
  styleUrl: './store-list.css',
})
export class StoreList implements OnInit {
  private service = inject(StoreService);
  private authService = inject(AuthService);

  stores = signal<Store[]>([]);
  esComerciante = computed(() => this.authService.loggedUser()?.role === 'ROLE_MERCHANT');

  page = signal(0);
  size = signal(10);
  sortBy = signal<StoreSortBy>('id');
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

    const query: PageQuery<StoreSortBy> = {
      page: this.page(),
      size: this.size(),
      sortBy: this.sortBy(),
      direction: this.direction(),
    };

    const rol = this.authService.loggedUser()?.role;

    const request =
      rol === 'ROLE_MERCHANT'
        ? this.service.getMyStores(query, { name: this.search() })
        : this.service.getStores(query, {
            name: this.search(),
            location: rol === 'ROLE_CONSUMER' ? Ubicacion_provisoria : undefined,
          });

    request.subscribe({
      next: (res) => {
        this.stores.set(res.content);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements);
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.error.set('No se pudieron cargar las tiendas');
        this.loading.set(false);
      },
    });
  }

  buscar(value: string): void {
    this.search.set(value);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.page.set(0);
      this.cargar();
    }, 300);
  }

  ordenar(col: StoreSortBy): void {
    if (this.sortBy() === col) {
      this.direction.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortBy.set(col);
      this.direction.set('asc');
    }
    this.page.set(0);
    this.cargar();
  }

  flecha(col: StoreSortBy): string {
    if (this.sortBy() !== col) return '';
    return this.direction() === 'asc' ? ' ↑' : ' ↓';
  }

  irAPagina(p: number): void {
    this.page.set(p);
    this.cargar();
  }
}