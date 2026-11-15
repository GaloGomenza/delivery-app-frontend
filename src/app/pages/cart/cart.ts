import { Component, inject, HostListener } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../services/cart-service';
import { OrderService } from '../../services/order-service';

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
  private router = inject(Router);

  direccion = '';
  paymentType: PaymentType | '' = '';

  enviando = false;
  error = '';

  incrementar(productId: number): void {

    const item = this.cartService.cart()?.items.find(
      item => item.product.id === productId
    );

    if (item) {
      this.cartService.updateQuantity(
        productId,
        item.quantity + 1
      );
    }
  }

  decrementar(productId: number): void {

    const item = this.cartService.cart()?.items.find(
      item => item.product.id === productId
    );

    if (item) {
      this.cartService.updateQuantity(
        productId,
        item.quantity - 1
      );
    }
  }

  eliminar(productId: number): void {
    this.cartService.removeProduct(productId);
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
      items: currentCart.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
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
          'No se pudo confirmar el pedido. Intentá nuevamente.';

        this.enviando = false;
      }

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