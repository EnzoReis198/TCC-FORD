import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { CarsService, Vehicle, VehicleData } from '../../services/cars.service';
import { AuthService } from '../../services/auth-service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-car-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [HttpClientModule]
})
export class DashboardComponent implements OnInit {
  modeloAtual: number = 0;
  vehicles: Vehicle[] = [];
  currentVehicle: Vehicle | null = null;
  currentVehicleData: VehicleData | null = null;
  loading: boolean = true;
  error: string = '';
  currentTemp: number = 22;

  constructor(
    private router: Router,
    private carsService: CarsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('🚀 Dashboard iniciando...');

    if (!this.carsService.isAuthenticated()) {
      console.log('❌ Não autenticado - redirecionando...');
      this.router.navigate(['/login']);
      return;
    }

    this.loadVehicles();
    this.setupTemperatureControls();
  }

  loadVehicles(): void {
    this.loading = true;
    this.error = '';

    this.carsService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        if (vehicles.length > 0) {
          this.currentVehicle = vehicles[0];
          this.modeloAtual = 0;
          this.loadVehicleData(vehicles[0].modelo);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar dados dos veículos';
        this.loading = false;

        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  loadVehicleData(modelo: string): void {
    this.carsService.getVehicleDataByModel(modelo).subscribe({
      next: (vehicleData) => {
        this.currentVehicleData = vehicleData || null;
        this.updateAllData();
      },
      error: (err) => {
        console.error('Erro ao carregar dados do veículo:', err);
      }
    });
  }

  updateAllData(): void {
    if (!this.currentVehicle) return;
    this.updateCombustivel();
    this.updateVendas();
    this.updateCodigo();
    this.updateOdometro();
    this.updateLatitude();
    this.updateLongitude();
    this.updateCarInfo();
    this.updateSystemStatus();
    this.updateVehicleHealth();
  }

  updateCombustivel(): void {
    if (!this.currentVehicleData) return;
    const nivel = parseInt(this.currentVehicleData.nivelCombustivel.replace('%', ''));

    const batteryValue = document.getElementById('batteryValue');
    if (batteryValue) this.animateNumber('batteryValue', 0, nivel, '%');

    const barFill = document.querySelector('.bar-fill') as HTMLElement;
    if (barFill) barFill.style.width = `${nivel}%`;

    const statusText = document.querySelector('.left .card .small');
    if (statusText) {
      statusText.textContent = this.currentVehicleData.status === 'on' ? 'Conectado' : 'Desconectado';
    }
  }

  updateVendas(): void {
    if (!this.currentVehicle) return;
    const autonomyValue = document.getElementById('autonomyValue');
    if (autonomyValue) this.animateNumber('autonomyValue', 0, this.currentVehicle.totalVendas, '');
  }

  updateCodigo(): void {
    if (!this.currentVehicleData) return;
    const efficiencyValue = document.getElementById('efficiencyValue');
    if (efficiencyValue) efficiencyValue.textContent = this.currentVehicleData.codigo;
  }

  updateOdometro(): void {
    if (!this.currentVehicleData) return;
    const travelTimeValue = document.getElementById('travelTimeValue');
    if (travelTimeValue) travelTimeValue.textContent = this.currentVehicleData.odometro;
  }

  updateLatitude(): void {
    if (!this.currentVehicleData) return;
    const performanceValue = document.getElementById('performanceValue');
    if (performanceValue) performanceValue.textContent = this.currentVehicleData.lat;
  }

  updateLongitude(): void {
    if (!this.currentVehicleData) return;
    const economyValue = document.getElementById('economyValue');
    if (economyValue) economyValue.textContent = this.currentVehicleData.long;
  }

  updateCarInfo(): void {
    if (!this.currentVehicle) return;

    const modeloNome = document.getElementById('modelo-nome');
    if (modeloNome) modeloNome.textContent = `FORD ${this.currentVehicle.modelo.toUpperCase()}`;

    const modeloDesc = document.getElementById('modelo-desc');
    if (modeloDesc) modeloDesc.textContent = `${this.currentVehicle.modelo} Model • 2024`;

    const carImage = document.getElementById('carImage') as HTMLImageElement;
    if (carImage) {
      let imagePath = this.currentVehicle.imagemUrl;
      if (!imagePath.startsWith('/') && !imagePath.startsWith('http')) {
        imagePath = '/' + imagePath;
      }

      carImage.src = imagePath;

      carImage.onload = () => {};
      carImage.onerror = () => {
        const modeloLower = this.currentVehicle!.modelo.toLowerCase();
        let fallbackPath = '/assets/img/carronovo.png';
        switch (modeloLower) {
          case 'mustang':
            fallbackPath = '/assets/img/carro1.png'; break;
          case 'ranger':
            fallbackPath = '/assets/img/carro2.png'; break;
          case 'territory':
            fallbackPath = '/assets/img/carro3.png'; break;
          case 'bronco sport':
            fallbackPath = '/assets/img/carro4.png'; break;
        }
        carImage.src = fallbackPath;
      };
    }
  }

  updateSystemStatus(): void {
    if (!this.currentVehicle) return;
    const statusElements = document.querySelectorAll('.status-list li span');

    if (statusElements.length >= 2) {
      statusElements[0].textContent = this.currentVehicle.veiculosConectados.toString();
      statusElements[1].textContent = this.currentVehicle.veiculosAtualizados.toString();
    }

    if (statusElements.length >= 3 && this.currentVehicleData) {
      statusElements[2].textContent = this.currentVehicleData.status === 'on' ? 'Conectado' : 'Desconectado';
    }

    if (statusElements.length >= 4 && this.currentVehicleData) {
      statusElements[3].textContent = this.currentVehicleData.status === 'on' ? 'Ativo' : 'Inativo';
    }
  }

  updateVehicleHealth(): void {
    if (!this.currentVehicleData) return;
    const isOnline = this.currentVehicleData.status === 'on';
    const combustivelLevel = parseInt(this.currentVehicleData.nivelCombustivel.replace('%', ''));
    const health = isOnline ? (combustivelLevel > 50 ? 98 : 85) : 70;

    const healthCircle = document.querySelector('.circle');
    if (healthCircle) healthCircle.textContent = `${health}%`;
  }

  animateNumber(elementId: string, start: number, end: number, suffix: string = ''): void {
    const element = document.getElementById(elementId);
    if (!element) return;

    let current = start;
    const step = (end - start) / 50;
    const interval = setInterval(() => {
      current += step;
      element.textContent = suffix === '%' ? current.toFixed(1) + suffix : Math.round(current).toString() + suffix;
      if (current >= end) {
        element.textContent = (suffix === '%' ? end.toFixed(1) : end.toString()) + suffix;
        clearInterval(interval);
      }
    }, 20);
  }

  trocarModelo(direcao: number): void {
    if (this.vehicles.length === 0) return;

    this.modeloAtual += direcao;
    if (this.modeloAtual < 0) this.modeloAtual = this.vehicles.length - 1;
    if (this.modeloAtual >= this.vehicles.length) this.modeloAtual = 0;

    this.currentVehicle = this.vehicles[this.modeloAtual];
    const carImage = document.getElementById('carImage') as HTMLImageElement;
    const infoContainer = document.getElementById('carInfoContainer');

    if (carImage) {
      carImage.classList.remove('fadeIn');
      carImage.classList.add('fadeOut');
    }

    if (infoContainer) {
      infoContainer.classList.remove('fadeIn');
      infoContainer.classList.add('fadeOut');
    }

    setTimeout(() => {
      this.loadVehicleData(this.currentVehicle!.modelo);

      setTimeout(() => {
        if (carImage) {
          carImage.classList.remove('fadeOut');
          carImage.classList.add('fadeIn');
        }

        if (infoContainer) {
          infoContainer.classList.remove('fadeOut');
          infoContainer.classList.add('fadeIn');
        }
      }, 100);

    }, 600);
  }

  setupTemperatureControls(): void {
    (window as any).changeTemp = (change: number) => {
      this.changeTemp(change);
    };
  }

  changeTemp(change: number): void {
    this.currentTemp += change;
    if (this.currentTemp < 16) this.currentTemp = 16;
    if (this.currentTemp > 30) this.currentTemp = 30;

    const tempDisplay = document.getElementById('tempDisplay');
    if (tempDisplay) {
      tempDisplay.textContent = `${this.currentTemp}°C`;
    }
  }

  getCurrentInfo(): any {
    return {
      vehicle: this.currentVehicle,
      vehicleData: this.currentVehicleData,
      modeloAtual: this.modeloAtual,
      totalVehicles: this.vehicles.length,
      loading: this.loading,
      error: this.error,
      currentTemp: this.currentTemp
    };
  }
}
