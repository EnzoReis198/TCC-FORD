import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (this.username && this.password) {
      alert(`Bem-vindo(a), ${this.username}!`);
      // Lógica real de login aqui...
    } else {
      alert('Preencha usuário e senha.');
    }
  }

    ngOnInit() {
    setTimeout(() => {
      this.showLoginBox = true; // ativa a classe para animar
    }, 50);
  }

  goBack() {
    this.router.navigate(['']); // ou ['/'] dependendo da sua rota home
  }
    showLoginBox = false;






}

