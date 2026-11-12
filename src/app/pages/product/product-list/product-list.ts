import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageQuery, ProductSortBy } from '../../../models/Pagination';
import { Product, ProductStatus } from '../../../models/Product';
import { Store } from '../../../models/Store';
import { ProductService } from '../../../services/product-service';
import { StoreService } from '../../../services/store-service';

@Component({
  imports: [RouterLink, FormsModule, CurrencyPipe],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private storeService = inject(StoreService);
  private route = inject(ActivatedRoute);

  stores = signal<Store[]>([]);
  storesLoaded = signal(false);
  storeId = signal<number | null>(null);

  products = signal<Product[]>([]);
  page = signal(0);
  size = signal(10);
  sortBy = signal<ProductSortBy>('id');
  direction = signal<'asc' | 'desc'>('asc');
  search = signal('');
  status = signal<ProductStatus | ''>('');
  totalPages = signal(0);
  totalElements = signal(0);

  loading = signal(false);
  error = signal<string | null>(null);
  private timer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.storeService.getMyStores().subscribe({
      next: (stores) => {
        this.stores.set(stores);
        this.storesLoaded.set(true);
        const wanted = Number(this.route.snapshot.queryParamMap.get('storeId'));
        const initial = stores.find((s) => s.id === wanted) ?? stores[0];
        if (initial) {
          this.storeId.set(initial.id);
          this.cargar();
        }
      },
      error: (err) => {
        console.log(err);
        this.storesLoaded.set(true);
        this.error.set('No se pudieron cargar tus comercios');
      },
    });
  }

  cargar(): void {
    if (this.storeId() === null) return;
    this.loading.set(true);
    this.error.set(null);

    const query: PageQuery = {
      page: this.page(),
      size: this.size(),
      sortBy: this.sortBy(),
      direction: this.direction(),
    };

    this.productService
      .getProducts(query, { name: this.search(), status: this.status(), storeId: this.storeId() })
      .subscribe({
        next: (res) => {
          this.products.set(res.content);
          this.totalPages.set(res.totalPages);
          this.totalElements.set(res.totalElements);
          this.loading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.error.set('No se pudieron cargar los productos');
          this.loading.set(false);
        },
      });
  }

  cambiarComercio(id: number): void {
    this.storeId.set(Number(id));
    this.page.set(0);
    this.cargar();
  }

  cambiarEstado(status: ProductStatus | ''): void {
    this.status.set(status);
    this.page.set(0);
    this.cargar();
  }

  buscar(value: string): void {
    this.search.set(value);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.page.set(0);
      this.cargar();
    }, 300);
  }

  ordenar(col: ProductSortBy): void {
    if (this.sortBy() === col) {
      this.direction.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortBy.set(col);
      this.direction.set('asc');
    }
    this.page.set(0);
    this.cargar();
  }

  flecha(col: ProductSortBy): string {
    if (this.sortBy() !== col) return '';
    return this.direction() === 'asc' ? ' ↑' : ' ↓';
  }

  irAPagina(p: number): void {
    this.page.set(p);
    this.cargar();
  }

  eliminar(p: Product): void {
    if (!confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return;
    this.productService.deleteProduct(p.id).subscribe({
      next: () => {
        if (this.products().length === 1 && this.page() > 0) this.page.update((n) => n - 1);
        this.cargar();
      },
      error: (err) => {
        console.log(err);
        this.error.set(`No se pudo eliminar "${p.name}"`);
      },
    });
  }
}