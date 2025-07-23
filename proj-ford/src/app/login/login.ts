import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService, UserProfile } from '../../services/auth-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule
  ]
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  showLoginBox = false;
  isLgpdAccepted: boolean = false; // Variável para controle do LGPD

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.showLoginBox = true;
    }, 50);
  }

  get isButtonDisabled(): boolean {
    return !this.isLgpdAccepted;
  }

  onSubmit() {
    const email = this.username.trim().toLowerCase();
    const senha = this.password.trim();

    if (!email || !senha) {
      alert('Preencha usuário e senha.');
      return;
    }

    if (!this.isLgpdAccepted) {
      alert('Você precisa aceitar a política de privacidade e LGPD para continuar.');
      return;
    }

    const body = { email, senha };

    console.log('Enviando para API:', body); // Pode remover depois

    this.http.post<any>('https://apienzo-production.up.railway.app/login', body).subscribe({
      next: (res) => {
        console.log('Login realizado:', res);

        const profile: UserProfile = {
          id: res.usuario.id,
          name: res.usuario.nome,
          email: res.usuario.email
        };

        this.authService.login(res.token, profile);
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Erro no login:', err);
        alert('Erro: ' + (err.error?.mensagem || 'Usuário ou senha inválidos.'));
      }
    });
  }

  goBack() {
    this.router.navigate(['']);
  }
}
