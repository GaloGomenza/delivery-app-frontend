import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoreService {

  private readonly apiURL = 'http://localhost:8080/api/v1/stores';

  constructor(private http : HttpClient){

  }

  getStores(){}
  
}
