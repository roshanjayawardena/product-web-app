import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { loginreponse, RefreshToken, userlogin } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  Login(_data: userlogin) {
    return this.httpClient.post<loginreponse>(`${this.baseUrl}Auth/login`, _data)
  } 

  RefreshToken(data: RefreshToken) {
    return this.httpClient.post<any>(`${this.baseUrl}Auth/refresh-token`, data);
  }
}
