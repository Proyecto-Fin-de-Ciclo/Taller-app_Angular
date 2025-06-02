import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// Ajusta la ruta a la ubicación real del modelo Cita
import { Cita } from '../models/cita';
import { User } from '../models/user';
import { Vehiculo } from '../models/vehiculo';

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
  crearCita(cita: Cita): Observable<Cita> {
  return this.http.post<Cita>(`${this.baseUrl}/CreateCita`, cita, this.httpOptions);
}
getUserByUsername(username: string): Observable<User> {
  return this.http.get<User>(`${this.baseUrl}/username/${username}`, this.httpOptions);
}
getVehiculoById(vehiculoId: number): Observable<Vehiculo> {
  return this.http.get<Vehiculo>(`${this.baseUrl}/vehiculo/findById/${vehiculoId}`, this.httpOptions);
}


  getCitasPorRango(fechaInicio: string, fechaFin: string): Observable<Cita[]> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get<Cita[]>(`${this.baseUrl}/GetCitasPorRango`, { params, headers: this.httpOptions.headers });
  }

}


