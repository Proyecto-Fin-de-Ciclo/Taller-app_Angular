import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// Ajusta la ruta a la ubicación real del modelo Cita
import { Cita } from '../models/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private baseUrl = 'http://localhost:3307/cita'; // Cambia según tu backend

  // Header con Basic Auth codificado admin:admin en base64 -> YWRtaW46YWRtaW4=
  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4='
    })
  };

  constructor(private http: HttpClient) {}

  getAllCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}/GetAllCitas`, this.httpOptions);
  }

  getCitasPorRango(fechaInicio: string, fechaFin: string): Observable<Cita[]> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get<Cita[]>(`${this.baseUrl}/GetCitasPorRango`, { params, headers: this.httpOptions.headers });
  }

}


