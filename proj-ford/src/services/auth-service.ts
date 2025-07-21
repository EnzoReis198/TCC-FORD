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

  // Simula login real com token e dados do usuário
  login(token: string, profile: UserProfile): void {
    localStorage.setItem('token', token);
    localStorage.setItem('profile', JSON.stringify(profile));
    this.loggedIn.next(true);
    this.userProfile.next(profile);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
      localStorage.removeItem('usuario'); // Remove também o usuário
    this.loggedIn.next(false);
    this.userProfile.next(null);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getProfile(): Observable<UserProfile | null> {
    return this.userProfile.asObservable();
  }

  checkInitialLogin(): void {
    const token = localStorage.getItem('token');
    const profileString = localStorage.getItem('profile');

    if (token && profileString) {
      try {
        const profile: UserProfile = JSON.parse(profileString);
        this.loggedIn.next(true);
        this.userProfile.next(profile);
      } catch (e) {
        console.error('Erro ao ler perfil do usuário do localStorage', e);
        this.loggedIn.next(false);
        this.userProfile.next(null);
      }
    } else {
      this.loggedIn.next(false);
      this.userProfile.next(null);
    }
  }
}
