import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { RefreshToken } from '../models/user.model';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const userService = inject(UserService);

  const token = authService.getToken();
  const refreshToken = authService.getRefreshToken();
  
  // Exclude the refresh token API and login API from interception
  if (req.url.includes('/Auth/refresh-token') || req.url.includes('/Auth/login')) {
    return next(req); // Skip interception for these APIs
  }

  // Attach token to request if it's valid
  if (token && !authService.isTokenExpired()) {
    const clonedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(clonedRequest);
  }

  // Handle expired token with refresh logic
  if (token && authService.isTokenExpired() && refreshToken) {

    const refreshTokenObj: RefreshToken = {
      accesstoken: token,
      refreshtoken: refreshToken,
    };
    
    return userService.RefreshToken(refreshTokenObj).pipe(
      switchMap((response) => {
        const newAccessToken = response.accessToken;
        const refreshToken = response.refreshToken;
        if (newAccessToken) {
          // Save new token and retry the original request
         authService.saveTokens(newAccessToken,refreshToken);

          const clonedRequest = req.clone({
            setHeaders: { Authorization: `Bearer ${newAccessToken}` },
          });

          return next(clonedRequest); // Retry with refreshed token
        } else {
          authService.logout(); // Logout if refresh fails
          return throwError(() => new Error('Failed to refresh token'));
        }
      }),
      catchError((error) => {
        console.error('Error during token refresh:', error);
        authService.logout();
        return throwError(() => error); // Pass the error down the pipeline
      })
    );
  }

  return next(req); // Forward the request without token if no valid token exists
};

