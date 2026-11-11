import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StoreService } from '../../services/store-service';
import { Store } from '../../models/Store';

@Component({
  selector: 'app-store-form',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './store-form.html',
  styleUrl: './store-form.css',
})
export class StoreForm implements OnInit{

  
  formStore !: FormGroup;
  id ?: number;

  constructor(
    private fb : FormBuilder,
    private service : StoreService,
    private route : ActivatedRoute,
    private router : Router

  ){}

  ngOnInit(): void {
    this.formStore = this.fb.group({
      name : ['', [Validators.required, Validators.minLength(3)]],
      address : ['', [Validators.required, Validators.minLength(3)]],
      latitude : ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude : ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      owner : ['', [Validators.required]]
    })  

    this.id = this.route.snapshot.params['id'];
    

    if(this.id){
      this.service.getStoreById(this.id).subscribe(store =>{
        this.formStore.patchValue(store);
      })
    }
  }

  onSubmit(){
    if (this.formStore.invalid) return;

    if (this.id){
      const storeData : Store = {
        id : this.id,
        ... this.formStore.value
      };
      this.service.updateStore(storeData).subscribe({
        next : () => this.router.navigate(['/store/list']),
        error : (e) => { console.log(e) }
      })
      alert("Comercio actualizado")
    } else{
      const storeData = this.formStore.value
      this.service.addStore(storeData).subscribe({
        next : () => this.router.navigate(['/store/list']),
        error : (e) => {console.log(e)}
      })
      alert("Comercio creado")
    }
    this.formStore.reset()
  }

}
