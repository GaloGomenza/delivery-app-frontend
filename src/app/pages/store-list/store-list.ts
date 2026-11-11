import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '../../models/Store';
import { StoreService } from '../../services/store-service';

@Component({
  selector: 'app-store-list',
  imports: [RouterLink],
  templateUrl: './store-list.html',
  styleUrl: './store-list.css',
})
export class StoreList implements OnInit{
  stores !: Store[]

  constructor(
    private service : StoreService
  ){
  }

  ngOnInit(): void {
      this.loadStores()
  }

  loadStores() : void {
    this.service.getStores().subscribe(
      (data) => {
        console.log(data),
        this.stores = data
      }
    )
  }

}
