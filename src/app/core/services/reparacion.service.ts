// src/app/core/services/reparacion.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reparacion } from '../models/reparacion';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReparacionService {
  private apiUrl = 'http://localhost:3307/reparacion'; // base URL de la API

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4='
    })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reparacion[]> {
    return this.http.get<Reparacion[]>(`${this.apiUrl}/GetAllReparaciones`, this.httpOptions);
  }

  getById(id: number): Observable<Reparacion> {
    return this.http.get<Reparacion>(`${this.apiUrl}/GetReparacionById/${id}`, this.httpOptions);
  }

  getReparacionesPorCliente(clienteId: number): Observable<Reparacion[]> {
  return this.http.get<Reparacion[]>(`${this.apiUrl}/GetReparacionesByUserId/${clienteId}`, this.httpOptions);
}
  getReparacionesPorFecha(inicio: string, fin: string): Observable<Reparacion[]> {
  return this.http.get<Reparacion[]>(`${this.apiUrl}/GetReparacionesByFecha?inicio=${inicio}&fin=${fin}`, this.httpOptions);
}
obtenerReparacionActivaConPresupuestoAceptado(vehiculoId: number): Observable<Reparacion> {
  return this.http.get<Reparacion>(
    `${this.apiUrl}/reparacion/ObtenerReparacionActivaConPresupuestoAceptado/${vehiculoId}`,
    this.httpOptions
  );
}

  add(reparacion: Reparacion): Observable<any> {
    console.log('JSON que envío:', JSON.stringify(reparacion));
    return this.http.post(`${this.apiUrl}/CreateReparacion`, reparacion, this.httpOptions);
  }

  updateEstado(id: number, nuevoEstado: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/UpdateEstadoReparacion/${id}/${nuevoEstado}`, null, this.httpOptions);
}
addOrdenDeTrabajo(reparacion: Reparacion, descripcion: string, matricula: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/AddOrdenDeTrabajo`, reparacion, {
    params: {
      descripcion,
      matricula
    },
    headers: this.httpOptions.headers
  });
}

  update(reparacion: Reparacion): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateReparacion`, reparacion, this.httpOptions);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteReparacion/${id}`, this.httpOptions);
  }
}
