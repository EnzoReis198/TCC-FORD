import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  photoUrl?: string;
  // outros campos que quiser guardar do usuário
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userProfile = new BehaviorSubject<UserProfile | null>(null);

  constructor() {
    // 🔥 IMPORTANTE: Verifica automaticamente se já está logado ao criar o service
    this.checkInitialLogin();
  }

  // Simula login real com token e dados do usuário
  login(token: string, profile: UserProfile): void {
    console.log('🔐 Fazendo login - salvando token e perfil');
    localStorage.setItem('token', token);
    localStorage.setItem('profile', JSON.stringify(profile));
    
    // Atualiza o estado IMEDIATAMENTE
    this.loggedIn.next(true);
    this.userProfile.next(profile);
    
    console.log('✅ Login feito - estado atualizado:', {
      token: !!localStorage.getItem('token'),
      profile: profile,
      loggedInState: this.loggedIn.value
    });
  }

  logout(): void {
    console.log('🚪 Fazendo logout - limpando dados');
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    localStorage.removeItem('usuario'); // Remove também o usuário
    
    // Atualiza o estado IMEDIATAMENTE
    this.loggedIn.next(false);
    this.userProfile.next(null);
    
    console.log('✅ Logout feito - estado limpo');
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getProfile(): Observable<UserProfile | null> {
    return this.userProfile.asObservable();
  }

  // Verifica se há login salvo e restaura o estado
  checkInitialLogin(): void {
    console.log('🔍 Verificando login inicial...');
    
    const token = localStorage.getItem('token');
    const profileString = localStorage.getItem('profile');

    console.log('Token no localStorage:', !!token);
    console.log('Profile no localStorage:', !!profileString);

    if (token && profileString) {
      try {
        const profile: UserProfile = JSON.parse(profileString);
        
        console.log('✅ Dados encontrados - restaurando login:', {
          token: !!token,
          profileName: profile.name
        });
        
        // Restaura o estado de login
        this.loggedIn.next(true);
        this.userProfile.next(profile);
        
        console.log('✅ Estado restaurado - usuário logado');
        
      } catch (e) {
        console.error('❌ Erro ao ler perfil do localStorage:', e);
        // Se der erro, limpa tudo
        this.logout();
      }
    } else {
      console.log('❌ Sem dados de login - usuário não logado');
      this.loggedIn.next(false);
      this.userProfile.next(null);
    }
  }

  // Método útil para debug
  getCurrentState(): { isLoggedIn: boolean, profile: UserProfile | null, hasToken: boolean } {
    return {
      isLoggedIn: this.loggedIn.value,
      profile: this.userProfile.value,
      hasToken: !!localStorage.getItem('token')
    };
  }
}