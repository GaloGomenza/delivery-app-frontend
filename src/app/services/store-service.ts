import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { PageQuery, PaginationResult } from '../models/Pagination';
import { Store } from '../models/Store';
import { User } from '../models/User';

export interface Ubicacion {
  latitude: number;
  longitude: number;
  distance: number;
}

export interface StoreFilter {
  name?: string;
  ownerId?: number | null;
  location?: Ubicacion;
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private http = inject(HttpClient);
  private apiUrl = 'api/v1/stores';

  getStores(query: PageQuery, filter: StoreFilter): Observable<PaginationResult<Store>> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('size', query.size)
      .set('sortBy', query.sortBy)
      .set('direction', query.direction);

    if (filter.name?.trim()) params = params.set('name', filter.name.trim());
    if (filter.ownerId != null) params = params.set('ownerId', filter.ownerId);
    if (filter.location) {
      params = params
        .set('latitude', filter.location.latitude)
        .set('longitude', filter.location.longitude)
        .set('distance', filter.location.distance);
    }

    return this.http.get<PaginationResult<Store>>(this.apiUrl, { params });
  }

  getMyStores(
    query: PageQuery,
    filter: Omit<StoreFilter, 'ownerId'>
  ): Observable<PaginationResult<Store>> {
    return this.http
      .get<User>('api/v1/users/me')
      .pipe(switchMap((me) => this.getStores(query, { ...filter, ownerId: me.id })));
  }

  getStoreById(id: number): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrl}/${id}`);
  }

  addStore(store: Store): Observable<Store> {
    return this.http.post<Store>(this.apiUrl, store);
  }

  updateStore(store: Store): Observable<Store> {
    return this.http.put<Store>(`${this.apiUrl}/${store.id}`, store);
  }

  deleteStore(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}