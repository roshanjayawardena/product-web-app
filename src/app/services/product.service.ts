import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { createproduct, product, productstatus } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  
  GetAllProducts() {
    return this.httpClient.get<product[]>(`${this.baseUrl}Product/GetAll`);
  }

  GetProductById(id : string) {
    return this.httpClient.get<product>(`${this.baseUrl}Product/${id}`);
  }

  CreateProduct(_data: createproduct) {
    return this.httpClient.post(`${this.baseUrl}Product/Create`, _data);
  }

  UpdateProduct(_data: createproduct) {
    return this.httpClient.put(`${this.baseUrl}Product/Update`, _data);
  }

  DeleteProduct(id: string) {
    return this.httpClient.delete(`${this.baseUrl}Product/${id}`);
  }

  UpdateStatus(_data : productstatus): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}Product/UpdateStatus`, _data);
  }
}
