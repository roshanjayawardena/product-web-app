import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const loginGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authService = inject(AuthService);
  
    if (authService.isLoggedIn()) {
      router.navigateByUrl('/'); // Redirect to home if logged in
      return false; // Prevent navigation to login
    }
    return true; // Allow navigation to login
  };