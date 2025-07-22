import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    // Primeiro verifica se tem token no localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('❌ Sem token - redirecionando para login');
      this.router.navigate(['/login']);
      return of(false);
    }

    // Se tem token, verifica o estado do AuthService
    return this.authService.isLoggedIn().pipe(
      take(1),
      map(isLoggedIn => {
        console.log('🔐 Status de login:', isLoggedIn);
        
        if (isLoggedIn) {
          console.log('✅ Usuário autenticado - permitindo acesso');
          return true;
        } else {
          console.log('❌ Usuário não autenticado - redirecionando para login');
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}