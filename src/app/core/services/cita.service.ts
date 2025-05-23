import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// Ajusta la ruta a la ubicación real del modelo Cita
import { Cita } from '../models/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private baseUrl = 'http://localhost:8080/cita'; // Cambia según tu backend

  constructor(private http: HttpClient) {}

  getAllCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}/GetAllCitas`);
  }

  getCitasPorRango(fechaInicio: string, fechaFin: string): Observable<Cita[]> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get<Cita[]>(`${this.baseUrl}/GetCitasPorRango`, { params });
  }

}

