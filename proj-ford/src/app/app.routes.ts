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
        path: 'cars',
        loadComponent: () => import('./cars/cars').then(m => m.CarsComponent),
        canActivate: [AuthGuard] // 🔒 Protege também se quiser
      },
        {
        path: 'suvs',
        loadComponent: () => import('./suvs/suvs').then(m => m.SuvsComponent),
        canActivate: [AuthGuard] // 🔒 Protege também se quiser
      },
        {
        path: 'vans',
        loadComponent: () => import('./vans/vans').then(m => m.VansComponent),
        canActivate: [AuthGuard] // 🔒 Protege também se quiser
      },
        {
        path: 'eletric',
        loadComponent: () => import('./eletric/eletric').then(m => m.EletricComponent),
        canActivate: [AuthGuard] // 🔒 Protege também se quiser
      },










      {
      path: '**',
      loadComponent: () => import('./not-found/not-found').then(m => m.NotFoundComponent)
      }

    ]
  }
];