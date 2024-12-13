import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CurrentUser } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '../models/customjwt.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey = 'AccessToken';
  private readonly refreshTokenKey = 'RefreshToken';
  private readonly userKey = 'User';

  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(this.getCurrentUser);
  currentUserSubject$ = this.currentUserSubject.asObservable();

  constructor() { }

  get getCurrentUser(): CurrentUser | null {
    const user = localStorage.getItem('User');
    return user ? JSON.parse(user) : null; // Safely handle null case
  }

  // Method to decode and store user information
  setCurrentUser(token: string): void {
    try {
      const decoded = jwtDecode<any>(token);
      const customJwtPayload: CurrentUser = {
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [],
        name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || '',
        email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || '',
      };

      this.currentUserSubject.next(customJwtPayload);
      localStorage.setItem(this.userKey, JSON.stringify(customJwtPayload));
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }

  logout(): void {
    this.removeTokens();
    this.currentUserSubject.next(null);
    localStorage.removeItem('User'); // Clear persisted user data  
  }

  // Save tokens in localStorage
  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.tokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  // Remove tokens in localStorage
  removeTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Get refresh token from localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }


  decodeToken(token: string): any {
    try {
      const decoded = jwtDecode<any>(token);
      // Map the values into the CustomJwtPayload object
      const customJwtPayload: CustomJwtPayload = {
        exp: decoded["exp"],
        Roles: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [],
        name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || '',
        emailaddress: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || '',
      };
      return customJwtPayload;
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (decodedToken?.exp) {
        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decodedToken.exp);
        return expirationDate < new Date();
      }
    }
    return true;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  getUserRole(): string {
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    return user.role || 'Guest';
  }
}
