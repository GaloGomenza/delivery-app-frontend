import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '../../models/Store';
import { StoreService, Ubicacion } from '../../services/store-service';
import { AuthService } from '../../auth/service/auth-service';
import { Ubicacion_provisoria } from '../../models/Ubicacion-provisoria';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-store-list',
  imports: [RouterLink],
  templateUrl: './store-list.html',
  styleUrl: './store-list.css',
})
export class StoreList implements OnInit {
  private authService = inject(AuthService)
  stores = signal<Store[]>([]);
  cargando = signal(true);
  esComerciante = this.authService.loggedUser()?.role === 'ROLE_MERCHANT'

  constructor(
    private service: StoreService
  ) {
  }

  ngOnInit(): void {
    this.loadStores()
  }

  loadStores(): void {
    const rol = this.authService.loggedUser()?.role;

    let request;

    if (rol === 'ROLE_MERCHANT') {
      request = this.service.getMyStores();
    } else if (rol === 'ROLE_CONSUMER') {
      request = this.service.getStores(Ubicacion_provisoria);
    } else {
      request = this.service.getStores();
    }

    this.cargando.set(true);

    request.pipe(
      finalize(() => this.cargando.set(false))
    ).subscribe({
      next: (data) => {
        this.stores.set(data);
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

}
