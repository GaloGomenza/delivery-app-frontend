import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '../models/Store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {

  private readonly apiURL = 'http://localhost:8080/api/v1/stores';

  constructor(private http : HttpClient){
  }

  getStores(){
    return this.http.get<Store[]>(this.apiURL)
  }

  getStoreById(id : number){
    return this.http.get<Store>(`${this.apiURL}/${id}`)
  }

  addStore(store : Store) : Observable<Store>{
    return this.http.post<Store>(this.apiURL, store)
  }

  updateStore(store : Store) : Observable<Store>{
    return this.http.put<Store>(`${this.apiURL}/${store.id}`, store)
  }

  deleteStore(id : number){
    return this.http.delete<Store>(`${this.apiURL}/${id}`)
  }
  
}
