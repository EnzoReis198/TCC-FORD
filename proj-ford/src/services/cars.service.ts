import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth-service';

export interface Vehicle {
  id: number;
  modelo: string;
  imagemUrl: string;
  totalVendas: number;
  veiculosConectados: number;
  veiculosAtualizados: number;
}

export interface VehicleData {
  codigo: string;
  modelo: string;
  odometro: string;
  nivelCombustivel: string;
  status: string;
  lat: string;
  long: string;
}

export interface ApiResponse {
  vehicle: Vehicle[];
  vehicleData: VehicleData[];
}

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Método para criar headers autenticados
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Busca todos os dados da API (vehicles + vehicleData)
  getVehiclesData(): Observable<ApiResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse>(`${this.apiUrl}/veicles`, { headers });
  }

  // Busca apenas os veículos
  getVehicles(): Observable<Vehicle[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse>(`${this.apiUrl}/veicles`, { headers }).pipe(
      map(data => data.vehicle)
    );
  }

  // Busca dados de um veículo específico por modelo
  getVehicleDataByModel(modelo: string): Observable<VehicleData | undefined> {
    const headers = this.getAuthHeaders();
    return this.http.get<ApiResponse>(`${this.apiUrl}/veicles`, { headers }).pipe(
      map(data => data.vehicleData.find(v => v.modelo === modelo))
    );
  }

  // Verifica se o usuário está autenticado antes de fazer requisições
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}