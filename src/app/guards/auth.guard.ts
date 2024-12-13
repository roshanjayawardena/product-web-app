import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);  
  
  if (authService.getToken()) {   
    return true; // Allow navigation
  } else {
    router.navigateByUrl('login'); // Redirect to login
    return false; // Prevent navigation
  }
};
