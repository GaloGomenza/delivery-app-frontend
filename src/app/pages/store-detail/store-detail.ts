import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { Store } from '../../models/Store';
import { StoreService } from '../../services/store-service';
import { Ubicacion_provisoria } from '../../models/Ubicacion-provisoria';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { AuthService } from '../../auth/service/auth-service';
import { Product } from '../../models/Product';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-store-detail',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './store-detail.html',
  styleUrl: './store-detail.css',
})
export class StoreDetail implements OnInit {

  private service = inject(StoreService);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  authService = inject(AuthService);
  cartService = inject(CartService)

  storeId = Number(this.route.snapshot.params['id']);
  esComerciante = this.authService.loggedUser()?.role === 'ROLE_MERCHANT';
  esConsumidor = this.authService.loggedUser()?.role === 'ROLE_CONSUMER';
  store = signal<Store | null>(null);
  products = signal<Product[]>([]);
  page = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  cargandoProductos = signal(false);
  errorProductos = signal<string | null>(null);
  mensajeCarrito = signal<string | null>(null);

  ngOnInit(): void {
    this.service.getStoreById(this.storeId).subscribe({
      next: (info) => this.store.set(info),
      error: (e) => console.log(e)
    })

    if (!this.esComerciante) {
      this.cargarProductos();
    }
  }

  cargarProductos(): void {
    this.cargandoProductos.set(true);
    this.errorProductos.set(null);

    this.productService
      .getProducts(
        {
          page: this.page(),
          size: 10,
          sortBy: 'name',
          direction: 'asc'
        },
        {
          storeId: this.storeId,
          status: this.esConsumidor ? 'AVAILABLE' : '',
          location: this.esConsumidor ? Ubicacion_provisoria : undefined,
        }
      )
      .subscribe({
        next: (res) => {
          this.products.set(res.content);
          this.totalPages.set(res.totalPages);
          this.totalElements.set(res.totalElements);
          this.cargandoProductos.set(false);
        },
        error: (e) => {
          console.log(e);
          this.errorProductos.set('No se pudieron cargar los productos');
          this.cargandoProductos.set(false);
        }
      });
  }

  agregarAlCarrito(product: Product): void {

    const currentStore = this.store();

    if (!currentStore) {
      return;
    }

    const added = this.cartService.addProduct(
      product,
      currentStore
    );

    if (!added) {
      this.mensajeCarrito.set(
        'Ya tenés un carrito de otro comercio. Finalizalo o cancelalo antes de comprar en este comercio.'
      );
      return;
    }

    this.mensajeCarrito.set(
      `${product.name} agregado al carrito`
    );
  }

  abrirCarrito(): void {
    this.router.navigate(['/cart']);
  }

  irAPagina(p: number): void {
    this.page.set(p);
    this.cargarProductos();
  }

  borrarStore() {
    this.service.deleteStore(this.storeId).subscribe({
      next: () => this.router.navigate(['store/list']),
      error: (e) => { console.log(e) }
    })
    alert("Comercio eliminado")
  }

  @HostListener('window:beforeunload', ['$event'])
  advertirAlCerrar(event: BeforeUnloadEvent): void {

    const currentCart = this.cartService.cart();

    if (currentCart && currentCart.storeId === this.storeId) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
