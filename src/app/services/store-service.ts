import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '../models/Store';
import { map, Observable, switchMap } from 'rxjs';
import { PaginationResult } from '../models/Pagination';
import { User } from '../models/User';

export interface Location {
  latitude : number;
  longitude : number;
  distance : number; // en km
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {

  private readonly apiURL = 'api/v1/stores';

  constructor(private http : HttpClient){
  }

  getStores(location ?: Location) : Observable<Store[]>{
    let params = new HttpParams()
      .set('page', 0)
      .set('size', 100)
      .set('sortBy', 'name')
      .set('direction', 'asc');
 
    if (location) {
      params = params
        .set('latitude', location.latitude)
        .set('longitude', location.longitude)
        .set('distance', location.distance);
    }

    return this.http
      .get<PaginationResult<Store>>(this.apiURL, { params })
      .pipe(map((res) => res.content));
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
  
  getMyStores() : Observable<Store[]>{
    const params = new HttpParams()
      .set('page', 0)
      .set('size', 100)
      .set('sortBy', 'name')
      .set('direction', 'asc');
 
    return this.http.get<User>('api/v1/users/me').pipe(
      switchMap((me) =>
        this.http
          .get<PaginationResult<Store>>(this.apiURL, { params })
          .pipe(map((res) => res.content.filter((s) => s.ownerId === me.id)))
      )
    );
  }
}
