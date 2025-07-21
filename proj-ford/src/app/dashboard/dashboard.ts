import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-car-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  modeloAtual: number = 0;

  modelos = [
    { nome: 'FORD F-150 LIGHTNING', desc: 'Pro Model • 2024', imgSrc: 'assets/img/carro1.png' },
    { nome: 'FORD MUSTANG GT', desc: 'V8 Performance • 2023', imgSrc: 'assets/img/carro2.png' },
    { nome: 'FORD BRONCO SPORT', desc: 'Adventure Series • 2024', imgSrc: 'assets/img/carro3.png' }
  ];


  // Função para animar os números (ex: bateria, autonomia)
  animateNumber(elementId: string, start: number, end: number): void {
    const element = document.getElementById(elementId);
    if (!element) return;

    let current = start;
    const step = (end - start) / 100;
    const interval = setInterval(() => {
      current += step;
      element.textContent = current.toFixed(1);
      if (current >= end) {
        clearInterval(interval);
      }
    }, 10);
  }

  // Função para trocar o modelo do carro
  trocarModelo(direcao: number): void {
    this.modeloAtual += direcao;
    if (this.modeloAtual < 0) this.modeloAtual = this.modelos.length - 1;
    if (this.modeloAtual >= this.modelos.length) this.modeloAtual = 0;

    const carImage = document.getElementById('carImage') as HTMLImageElement;
    carImage.style.animation = 'fadeOut 1.5s forwards';

    setTimeout(() => {
      carImage.src = this.modelos[this.modeloAtual].imgSrc; // Atualiza a imagem
      document.getElementById('modelo-nome')!.textContent = this.modelos[this.modeloAtual].nome;
      document.getElementById('modelo-desc')!.textContent = this.modelos[this.modeloAtual].desc;

      // Inicia a animação de "aparecer"
      carImage.style.animation = 'fadeIn 1.5s forwards';
    }, 1500); // Espera a animação de fadeOut terminar antes de mudar a imagem
  }

  ngOnInit(): void {
    // Inicia animação ao carregar a página
    this.animateNumber('batteryValue', 0, 78.0);
    this.animateNumber('autonomyValue', 0, 502);
    this.animateNumber('efficiencyValue', 0, 4.2);
    this.animateNumber('travelTimeValue', 0, 2.34);
    this.animateNumber('performanceValue', 0, 85);
    this.animateNumber('economyValue', 0, 2847);
  }
}
