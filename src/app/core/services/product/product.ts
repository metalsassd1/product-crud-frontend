import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5084/api/products';

  getAll(search = '', page = 1, pageSize = 10) {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('pageSize', pageSize);
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  update(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  deleteList(ids: number[]) {
    return this.http.post(`${this.apiUrl}/deleteList`, { Ids: ids });
  }
}