import { Component, OnInit } from '@angular/core';
import { Store } from '../../models/Store';
import { StoreService } from '../../services/store-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-store-detail',
  imports: [RouterLink],
  templateUrl: './store-detail.html',
  styleUrl: './store-detail.css',
})
export class StoreDetail implements OnInit{

  store ?: Store

  constructor(
    private service : StoreService,
    private route : ActivatedRoute,
    private router : Router
  ){  }

  ngOnInit(): void {
      const id = this.route.snapshot.params['id']
      this.service.getStoreById(id).subscribe( info =>
        this.store = info
      )
  }

  borrarStore(){
    const id = this.route.snapshot.params['id'];
    this.service.deleteStore(id).subscribe({
      next : () => this.router.navigate(['store/list']),
      error : (e) => {console.log(e)}
    })
    alert("Comercio eliminado")
  }
}

