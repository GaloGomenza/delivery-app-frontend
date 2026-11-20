import { Injectable, signal } from '@angular/core';
import { Product } from '../models/Product';
import { Store } from '../models/Store';
import { CartItem } from '../models/CartItem';

export interface CartState {
  storeId: number;
  storeName: string;
  storeAddress: string;
  latitude: number;
  longitude: number;
  items: CartItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private storageKey = 'deliveryCart';
  readonly MAX_UNIDADES = 5;

  cart = signal<CartState | null>(this.loadCart());

  private loadCart(): CartState | null {
    const stored = sessionStorage.getItem(this.storageKey);

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as CartState;
    } catch {
      sessionStorage.removeItem(this.storageKey);
      return null;
    }
  }

  private saveCart(): void {
    const currentCart = this.cart();

    if (currentCart) {
      sessionStorage.setItem(
        this.storageKey,
        JSON.stringify(currentCart)
      );
    } else {
      sessionStorage.removeItem(this.storageKey);
    }
  }

  addProduct(product: Product, store: Store): boolean {

    let currentCart = this.cart();

    if (currentCart && currentCart.storeId !== store.id) {
      return false;
    }

    if (!currentCart) {
      currentCart = {
        storeId: store.id,
        storeName: store.name,
        storeAddress: store.address,
        latitude: store.latitude,
        longitude: store.longitude,
        items: []
      };
    }

    const existingItem = currentCart.items.find(
      item => item.product.id === product.id
    );

    if (existingItem) {
      if (existingItem.quantity >= this.MAX_UNIDADES) {
        return false;
      }
      existingItem.quantity++;
    } else {
      currentCart.items.push({
        product,
        quantity: 1
      });
    }

    this.cart.set({ ...currentCart });
    this.saveCart();

    return true;
  }

  removeProduct(productId: number): void {

    const currentCart = this.cart();

    if (!currentCart) {
      return;
    }

    currentCart.items = currentCart.items.filter(
      item => item.product.id !== productId
    );

    if (currentCart.items.length === 0) {
      this.clear();
      return;
    }

    this.cart.set({ ...currentCart });
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number): void {

    const currentCart = this.cart();

    if (!currentCart) {
      return;
    }

    if (quantity <= 0) {
      this.removeProduct(productId);
      return;
    }

    if (quantity > this.MAX_UNIDADES) {
      return;
    }

    const item = currentCart.items.find(
      item => item.product.id === productId
    );

    if (!item) {
      return;
    }

    item.quantity = quantity;

    this.cart.set({ ...currentCart });
    this.saveCart();
  }

  getTotal(): number {
    const currentCart = this.cart();

    if (!currentCart) {
      return 0;
    }

    return currentCart.items.reduce(
      (total, item) =>
        total + item.product.price * item.quantity,
      0
    );
  }

  getTotalItems(): number {
    const currentCart = this.cart();

    if (!currentCart) {
      return 0;
    }

    return currentCart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  clear(): void {
    this.cart.set(null);
    sessionStorage.removeItem(this.storageKey);
  }
}