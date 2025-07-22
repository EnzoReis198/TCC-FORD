import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService, UserProfile } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [
HttpClientModule
  ]
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  showLoginBox = false;

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

  onSubmit() {
    if (!this.username || !this.password) {
      alert('Preencha usuário e senha.');
      return;
    }

    const body = {
      email: this.username,
      senha: this.password
    };

    this.http.post<any>('https://apienzo-production.up.railway.app/login', body).subscribe({
      next: (res) => {
        console.log('Login realizado:', res);

        // Cria o perfil do usuário com os dados da API
        const profile: UserProfile = {
          id: res.usuario.id,
          name: res.usuario.nome,
          email: res.usuario.email,
          // photoUrl se tiver, pode adicionar aqui
        };

        // Usa o AuthService para salvar token e perfil (atualiza estado global)
        this.authService.login(res.token, profile);

        // Redireciona para home
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Erro no login:', err);
        alert('Usuário ou senha inválidos.');
      }
    });
  }

  goBack() {
    this.router.navigate(['']);
  }
}
