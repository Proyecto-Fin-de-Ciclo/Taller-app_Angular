import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehiculo } from '../../core/models/vehiculo';

@Injectable({
  providedIn: 'root',
})
export class VehiculoService {
  private baseUrl = 'http://localhost:3307/vehiculo';

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4='
    }),
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${this.baseUrl}/GetAllVehiculos`, this.httpOptions);
  }

  getById(id: number): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.baseUrl}/GetVehiculoById/${id}`, this.httpOptions);
  }
  getByMatricula(matriculaBusqueda: String): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.baseUrl}/GetVehiculoByMatricula/${matriculaBusqueda}`, this.httpOptions);
  }

  create(vehiculo: Vehiculo): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/CreateVehiculo`, vehiculo, this.httpOptions);
  }

  update(vehiculo: Vehiculo): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/UpdateVehiculo`, vehiculo, this.httpOptions);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/DeleteVehiculo/${id}`, this.httpOptions);
  }
}
