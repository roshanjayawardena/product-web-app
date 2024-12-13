import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductCreateEditComponent } from './components/product-create-edit/product-create-edit.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [

      {
        path: '',
        component: ProductListComponent,
        canActivate: [authGuard]
      },
      {
        path: 'create-product',
        component: ProductCreateEditComponent,
        canActivate: [authGuard]
      },
      {
        path: 'product/:id',
        component: ProductCreateEditComponent,
        canActivate: [authGuard]
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [loginGuard]
      },     
      { path: '**', redirectTo: '', pathMatch: 'full' }
];
