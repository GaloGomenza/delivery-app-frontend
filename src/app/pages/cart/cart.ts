import { Component, inject, HostListener } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CartService } from '../../services/cart-service';
import { OrderService } from '../../services/order-service';
import { ProductService } from '../../services/product-service';

import { PaymentType } from '../../models/OrderEnums';
import { CreateOrderRequest } from '../../models/CreateOrderRequest';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  cartService = inject(CartService);

  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private router = inject(Router);

  direccion = '';
  paymentType: PaymentType | '' = '';

  enviando = false;
  error = '';

  incrementar(productId: number): void {
    const item = this.cartService.cart()?.items.find(
      (item) => item.product.id === productId
    );

    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decrementar(productId: number): void {
    const item = this.cartService.cart()?.items.find(
      (item) => item.product.id === productId
    );

    if (item) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
      this.error = '';
    }
  }

  eliminar(productId: number): void {
    this.cartService.removeProduct(productId);
    this.error = '';
  }

  cancelarCarrito(): void {
    const confirmed = window.confirm(
      '¿Estás seguro de que querés cancelar el carrito? Se perderán todos los productos seleccionados.'
    );

    if (confirmed) {
      this.cartService.clear();
      this.router.navigate(['/store/list']);
    }
  }

  confirmarPedido(): void {
    const currentCart = this.cartService.cart();

    if (!currentCart || currentCart.items.length === 0) {
      return;
    }

    if (!this.paymentType) {
      return;
    }

    const request: CreateOrderRequest = {
      customerAddress: this.direccion.trim() || undefined,
      paymentType: this.paymentType,
      items: currentCart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    this.enviando = true;
    this.error = '';

    this.orderService.createOrder(request).subscribe({
      next: (order) => {
        this.cartService.clear();
        this.enviando = false;
        this.router.navigate(['/orders', order.id]);
      },

      error: (err) => {
        console.error(err);

        this.error =
          err.error?.message ||
          (typeof err.error === 'string' ? err.error : null) ||
          'No se pudo confirmar la compra por falta de stock. Revisá las cantidades e intentá nuevamente.';

        this.enviando = false;

        // Actualiza el stock real de cada producto sin borrar las cantidades del carrito
        forkJoin(
          currentCart.items.map((item) =>
            this.productService.getProduct(item.product.id)
          )
        ).subscribe({
          next: (productosActualizados) =>
            this.cartService.syncProducts(productosActualizados),
          error: () => {},
        });
      },
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  advertirAlCerrar(event: BeforeUnloadEvent): void {
    if (this.cartService.cart()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }
}