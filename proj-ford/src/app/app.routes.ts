import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell';

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
      }
    ]
  }
];
