import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { CartService } from '../services/cart-service';

export const cartLeaveGuard: CanDeactivateFn<unknown> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {

  const cartService = inject(CartService);
  const cart = cartService.cart();

  if (!cart || cart.items.length === 0) {
    return true;
  }

  const nextUrl = nextState?.url ?? '';

  if (nextUrl === '/cart') {
    return true;
  }

  if (nextUrl.startsWith(`/store/detail/${cart.storeId}`)) {
    return true;
  }

  const confirmed = window.confirm(
    'Tenés un carrito sin confirmar. Si salís, perderás todos los productos seleccionados. ¿Querés continuar?'
  );

  if (confirmed) {
    cartService.clear();
  }

  return confirmed;
};