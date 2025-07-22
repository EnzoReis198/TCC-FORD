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
  
  // Controle de temperatura
  currentTemp: number = 22;

  constructor(
    private router: Router,
    private carsService: CarsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('🚀 Dashboard iniciando...');
    
    // Verificar autenticação
    if (!this.carsService.isAuthenticated()) {
      console.log('❌ Não autenticado - redirecionando...');
      this.router.navigate(['/login']);
      return;
    }

    // Carregar veículos da API
    this.loadVehicles();
    
    // Configurar controles de temperatura
    this.setupTemperatureControls();
  }

  loadVehicles(): void {
    console.log('📡 Carregando veículos da API...');
    this.loading = true;
    this.error = '';
    
    this.carsService.getVehicles().subscribe({
      next: (vehicles) => {
        console.log('✅ Veículos carregados:', vehicles);
        this.vehicles = vehicles;
        
        if (vehicles.length > 0) {
          this.currentVehicle = vehicles[0];
          this.modeloAtual = 0;
          this.loadVehicleData(vehicles[0].modelo);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar veículos:', err);
        this.error = 'Erro ao carregar dados dos veículos';
        this.loading = false;
        
        // Se erro de autenticação, fazer logout
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  loadVehicleData(modelo: string): void {
    console.log('📊 Carregando dados para:', modelo);
    
    this.carsService.getVehicleDataByModel(modelo).subscribe({
      next: (vehicleData) => {
        console.log('✅ Dados do veículo carregados:', vehicleData);
        this.currentVehicleData = vehicleData || null;
        this.updateAllData();
      },
      error: (err) => {
        console.error('❌ Erro ao carregar dados do veículo:', err);
      }
    });
  }

  // Atualiza TODOS os dados da dashboard
  updateAllData(): void {
    if (!this.currentVehicle) return;
    
    console.log('🔄 Atualizando todos os dados da dashboard');
    
    // 1. COMBUSTÍVEL - do vehicleData
    this.updateCombustivel();
    
    // 2. VENDAS - do vehicle.totalVendas
    this.updateVendas();
    
    // 3. CÓDIGO - do vehicleData.codigo
    this.updateCodigo();
    
    // 4. ODÔMETRO - do vehicleData.odometro
    this.updateOdometro();
    
    // 5. LATITUDE - do vehicleData.lat
    this.updateLatitude();
    
    // 6. LONGITUDE - do vehicleData.long
    this.updateLongitude();
    
    // 7. INFORMAÇÕES DO CARRO
    this.updateCarInfo();
    
    // 8. STATUS DO SISTEMA
    this.updateSystemStatus();
    
    // 9. SAÚDE DO VEÍCULO - baseado no status
    this.updateVehicleHealth();
  }

  updateCombustivel(): void {
    if (!this.currentVehicleData) return;
    
    const nivel = parseInt(this.currentVehicleData.nivelCombustivel.replace('%', ''));
    
    // Atualiza o valor
    const batteryValue = document.getElementById('batteryValue');
    if (batteryValue) {
      this.animateNumber('batteryValue', 0, nivel, '%');
    }
    
    // Atualiza a barra
    const barFill = document.querySelector('.bar-fill') as HTMLElement;
    if (barFill) {
      barFill.style.width = `${nivel}%`;
    }
    
    // Atualiza status (conectado/desconectado)
    const statusText = document.querySelector('.left .card .small');
    if (statusText) {
      statusText.textContent = this.currentVehicleData.status === 'on' ? 'Conectado' : 'Desconectado';
    }
  }

  updateVendas(): void {
    if (!this.currentVehicle) return;
    
    const autonomyValue = document.getElementById('autonomyValue');
    if (autonomyValue) {
      this.animateNumber('autonomyValue', 0, this.currentVehicle.totalVendas, '');
    }
  }

  updateCodigo(): void {
    if (!this.currentVehicleData) return;
    
    const efficiencyValue = document.getElementById('efficiencyValue');
    if (efficiencyValue) {
      efficiencyValue.textContent = this.currentVehicleData.codigo;
    }
  }

  updateOdometro(): void {
    if (!this.currentVehicleData) return;
    
    const travelTimeValue = document.getElementById('travelTimeValue');
    if (travelTimeValue) {
      travelTimeValue.textContent = this.currentVehicleData.odometro;
    }
  }

  updateLatitude(): void {
    if (!this.currentVehicleData) return;
    
    const performanceValue = document.getElementById('performanceValue');
    if (performanceValue) {
      performanceValue.textContent = this.currentVehicleData.lat;
    }
  }

  updateLongitude(): void {
    if (!this.currentVehicleData) return;
    
    const economyValue = document.getElementById('economyValue');
    if (economyValue) {
      economyValue.textContent = this.currentVehicleData.long;
    }
  }

  updateCarInfo(): void {
    if (!this.currentVehicle) return;
    
    // Nome do modelo
    const modeloNome = document.getElementById('modelo-nome');
    if (modeloNome) {
      modeloNome.textContent = `FORD ${this.currentVehicle.modelo.toUpperCase()}`;
    }
    
    // Descrição
    const modeloDesc = document.getElementById('modelo-desc');
    if (modeloDesc) {
      modeloDesc.textContent = `${this.currentVehicle.modelo} Model • 2024`;
    }
    
    // Imagem do carro - corrige o caminho se necessário
    const carImage = document.getElementById('carImage') as HTMLImageElement;
    if (carImage) {
      let imagePath = this.currentVehicle.imagemUrl;
      
      // Corrige o caminho se não começar com /
      if (!imagePath.startsWith('/') && !imagePath.startsWith('http')) {
        imagePath = '/' + imagePath;
      }
      
      console.log('🖼️ Tentando carregar imagem:', imagePath);
      console.log('📁 Modelo atual:', this.currentVehicle.modelo);
      
      carImage.src = imagePath;
      
      // Handlers para debug
      carImage.onload = () => {
        console.log('✅ Imagem carregada com sucesso:', imagePath);
      };
      
      carImage.onerror = () => {
        console.error('❌ Erro ao carregar imagem:', imagePath);
        console.log('🔍 Tentando fallback baseado no modelo...');
        
        // Fallback específico por modelo em vez de sempre carro1.png
        const modeloLower = this.currentVehicle!.modelo.toLowerCase();
        let fallbackPath = '';
        
        switch(modeloLower) {
          case 'mustang':
            fallbackPath = '/assets/img/carro1.png';
            break;
          case 'ranger':
            fallbackPath = '/assets/img/carro2.png';
            break;
          case 'territory':
            fallbackPath = '/assets/img/carro3.png';
            break;
          case 'bronco sport':
            fallbackPath = '/assets/img/carro4.png';
            break;
          default:
            fallbackPath = '/assets/img/carronovo.png';
        }
        
        console.log('🔄 Usando fallback:', fallbackPath);
        carImage.src = fallbackPath;
      };
    }
  }

  updateSystemStatus(): void {
    if (!this.currentVehicle) return;
    
    // Atualiza os spans da lista de status
    const statusElements = document.querySelectorAll('.status-list li span');
    
    if (statusElements.length >= 2) {
      statusElements[0].textContent = this.currentVehicle.veiculosConectados.toString();
      statusElements[1].textContent = this.currentVehicle.veiculosAtualizados.toString();
    }
    
    // Atualiza status do bluetooth baseado no status do veículo
    if (statusElements.length >= 3 && this.currentVehicleData) {
      statusElements[2].textContent = this.currentVehicleData.status === 'on' ? 'Conectado' : 'Desconectado';
    }
    
    // Atualiza status geral
    if (statusElements.length >= 4 && this.currentVehicleData) {
      statusElements[3].textContent = this.currentVehicleData.status === 'on' ? 'Ativo' : 'Inativo';
    }
  }

  updateVehicleHealth(): void {
    if (!this.currentVehicleData) return;
    
    // Calcula saúde baseada no status e nível de combustível
    const isOnline = this.currentVehicleData.status === 'on';
    const combustivelLevel = parseInt(this.currentVehicleData.nivelCombustivel.replace('%', ''));
    
    // Fórmula simples: se online e combustível > 50% = saúde alta
    let health = isOnline ? (combustivelLevel > 50 ? 98 : 85) : 70;
    
    const healthCircle = document.querySelector('.circle');
    if (healthCircle) {
      healthCircle.textContent = `${health}%`;
    }
  }

  // Função melhorada de animação
  animateNumber(elementId: string, start: number, end: number, suffix: string = ''): void {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Elemento ${elementId} não encontrado`);
      return;
    }

    let current = start;
    const step = (end - start) / 50; // Mais rápido
    const interval = setInterval(() => {
      current += step;
      if (suffix === '%') {
        element.textContent = current.toFixed(1) + suffix;
      } else {
        element.textContent = Math.round(current).toString() + suffix;
      }
      
      if (current >= end) {
        element.textContent = (suffix === '%' ? end.toFixed(1) : end.toString()) + suffix;
        clearInterval(interval);
      }
    }, 20);
  }

  // Função para trocar modelo com animação
  trocarModelo(direcao: number): void {
    if (this.vehicles.length === 0) {
      console.warn('Nenhum veículo carregado ainda');
      return;
    }

    this.modeloAtual += direcao;
    if (this.modeloAtual < 0) this.modeloAtual = this.vehicles.length - 1;
    if (this.modeloAtual >= this.vehicles.length) this.modeloAtual = 0;

    this.currentVehicle = this.vehicles[this.modeloAtual];
    console.log('🚗 Trocando para:', this.currentVehicle.modelo);

    const carImage = document.getElementById('carImage') as HTMLImageElement;
    if (carImage) {
      carImage.style.animation = 'fadeOut 1.5s forwards';

      setTimeout(() => {
        // Carrega novos dados ANTES de aplicar a animação
        this.loadVehicleData(this.currentVehicle!.modelo);
        
        // Aguarda um pouco mais para garantir que a imagem está carregada
        setTimeout(() => {
          carImage.style.animation = 'fadeIn 1.5s forwards';
        }, 200);
        
      }, 1500);
    } else {
      // Se não encontrar a imagem, atualiza direto
      this.loadVehicleData(this.currentVehicle!.modelo);
    }
  }

  // Configurar controles de temperatura
  setupTemperatureControls(): void {
    // Expor função global para os botões HTML
    (window as any).changeTemp = (change: number) => {
      this.changeTemp(change);
    };
  }

  // Função para alterar temperatura
  changeTemp(change: number): void {
    this.currentTemp += change;
    if (this.currentTemp < 16) this.currentTemp = 16;
    if (this.currentTemp > 30) this.currentTemp = 30;
    
    const tempDisplay = document.getElementById('tempDisplay');
    if (tempDisplay) {
      tempDisplay.textContent = `${this.currentTemp}°C`;
    }
    
    console.log('🌡️ Temperatura alterada para:', this.currentTemp);
  }

  // Método útil para debug
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