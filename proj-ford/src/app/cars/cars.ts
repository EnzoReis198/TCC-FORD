import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cars',
  imports: [],
  templateUrl: './cars.html',
  styleUrl: './cars.css'
})
export class CarsComponent {


constructor(private router: Router) {}

irParaDashboard () {
  this.router.navigate(['/dashboard']);
}

}


