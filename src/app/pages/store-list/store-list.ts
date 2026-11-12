import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '../../models/Store';
import { StoreService, Location } from '../../services/store-service';
import { AuthService } from '../../auth/service/auth-service';

const UBICACION_PROVISORIA : Location = {
  latitude : -37.994,
  longitude : -57.555,
  distance : 200
}

@Component({
  selector: 'app-store-list',
  imports: [RouterLink],
  templateUrl: './store-list.html',
  styleUrl: './store-list.css',
})
export class StoreList implements OnInit{
  private authService = inject(AuthService)
  stores !: Store[]
  cargando = true
  esComerciante = this.authService.loggedUser()?.role ==='ROLE_MERCHANT'

  constructor(
    private service : StoreService
  ){
  }

  ngOnInit(): void {
      this.loadStores()
  }

  loadStores() : void {
    const rol = this.authService.loggedUser()?.role
 
    let request
    if (rol === 'ROLE_MERCHANT') {
      request = this.service.getMyStores()
    } else if (rol === 'ROLE_CONSUMER') {
      request = this.service.getStores(UBICACION_PROVISORIA)
    } else {
      request = this.service.getStores()
    }
 
    request.subscribe({
      next : (data) => {
        this.stores = data
        this.cargando = false
      },
      error : (e) => {
        console.log(e)
        this.cargando = false
      }
    })
  }

}
