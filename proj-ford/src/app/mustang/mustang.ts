import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../app.routes';

@Component({
  selector: 'app-mustang',
  templateUrl: './mustang.html',
  styleUrl: './mustang.css'
})
export class MustangComponent {

  constructor(private router: Router) {}

  irParaHome() {
    this.router.navigate(['']);
  }

}
