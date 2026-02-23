import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login';
import { RegisterComponent } from './pages/auth/register/register';
import { AppLayoutComponent } from './layout/app-layout';
import { authGuard } from './auth/guards/auth.guard';

import { LimitCreateComponent } from './pages/limit/create/create';
import { LimitSearchComponent } from './pages/limit/search/search';
import { LimitUpdateComponent } from './pages/limit/update/update';
import { LimitDeleteComponent } from './pages/limit/delete/delete';
import { PixAuthorizeComponent } from './pages/transaction/authorize/authorize';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      // Gestão de limite
      { path: 'limit/create', component: LimitCreateComponent },
      { path: 'limit/search', component: LimitSearchComponent }, 
      { path: 'limit/update', component: LimitUpdateComponent },
      { path: 'limit/delete', component: LimitDeleteComponent }, 

      // Transação pix
      { path: 'pix/authorize', component: PixAuthorizeComponent },
    ],
  },

  { path: '**', redirectTo: 'limit/search' },
];