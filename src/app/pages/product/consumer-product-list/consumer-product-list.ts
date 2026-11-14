
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { PageQuery } from '../../../models/Pagination';
import { Product } from '../../../models/Product';
import { Ubicacion_provisoria } from '../../../models/Ubicacion-provisoria';
import { ProductService } from '../../../services/product-service';

type ProductSortBy = 'id' | 'name' | 'price';

@Component({
  selector: 'app-consumer-product-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './consumer-product-list.html',
  styleUrl: './consumer-product-list.css',
})
export class ConsumerProductList implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);

  page = signal(0);
  size = signal(10);
  sortBy = signal<ProductSortBy>('name');
  direction = signal<'asc' | 'desc'>('asc');

  search = signal('');
  totalPages = signal(0);
  totalElements = signal(0);

  loading = signal(false);
  error = signal<string | null>(null);

  private timer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading.set(true);
    this.error.set(null);

    const query: PageQuery = {
      page: this.page(),
      size: this.size(),
      sortBy: this.sortBy(),
      direction: this.direction(),
    };

    this.productService
      .getProducts(query, {
        name: this.search(),
        status: 'AVAILABLE',
        location: Ubicacion_provisoria,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.products.set(res.content);
          this.totalPages.set(res.totalPages);
          this.totalElements.set(res.totalElements);
        },
        error: (err) => {
          console.error(err);
          this.error.set('No se pudieron cargar los productos.');
        },
      });
  }

  buscar(value: string): void {
    this.search.set(value);

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.page.set(0);
      this.cargarProductos();
    }, 300);
  }

  ordenar(col: ProductSortBy): void {
    if (this.sortBy() === col) {
      this.direction.update((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(col);
      this.direction.set('asc');
    }

    this.page.set(0);
    this.cargarProductos();
  }

  flecha(col: ProductSortBy): string {
    if (this.sortBy() !== col) return '';

    return this.direction() === 'asc' ? ' ↑' : ' ↓';
  }

  irAPagina(p: number): void {
    this.page.set(p);
    this.cargarProductos();
  }
}
