import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell';
import { AuthGuard } from './guards/aut.guard';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./app').then(m => m.AppComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./login/login').then(m => m.LoginComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent),
        canActivate: [AuthGuard] // 🔒 Protege a rota - só acessa logado
      },
      {
        path: 'mustang',
        loadComponent: () => import('./mustang/mustang').then(m => m.MustangComponent),
        canActivate: [AuthGuard] // 🔒 Protege também se quiser
      },
      {
      path: '**',
      loadComponent: () => import('./not-found/not-found').then(m => m.NotFoundComponent)
      }

    ]
  }
];