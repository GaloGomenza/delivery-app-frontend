import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageQuery, PaginationResult } from '../models/Pagination';
import { Product, ProductRequest, ProductStatus } from '../models/Product';
import { Ubicacion } from './store-service';
 
export interface ProductFilter {
  name?: string;
  status?: ProductStatus | '';
  storeId?: number | null;
  location?: Ubicacion;
}
 
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'api/v1/products';
 
  getProducts(query: PageQuery, filter: ProductFilter): Observable<PaginationResult<Product>> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('size', query.size)
      .set('sortBy', query.sortBy)
      .set('direction', query.direction);
 
    if (filter.name?.trim()) params = params.set('name', filter.name.trim());
    if (filter.status) params = params.set('status', filter.status);
    if (filter.storeId != null) params = params.set('storeId', filter.storeId);

    if (filter.location) {
  params = params
    .set('latitude', filter.location.latitude)
    .set('longitude', filter.location.longitude)
    .set('distance', filter.location.distance);
}
 
    return this.http.get<PaginationResult<Product>>(this.apiUrl, { params });
  }
 
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
 
  createProduct(body: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, body);
  }
 
  updateProduct(id: number, body: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, body);
  }
 
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}