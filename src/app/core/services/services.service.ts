// src/app/core/services/orden-de-trabajo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdenDeTrabajoDTO } from '../models/ordenDeTrabajo';

@Injectable({
  providedIn: 'root'
})
export class OrdenDeTrabajoService {
  private apiUrl = 'http://localhost:3307/ordenDeTrabajo';

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4=' // auth básica, como en ReparacionService
    })
  };

  constructor(private http: HttpClient) {}

  // Obtener todas las órdenes
  getAll(): Observable<OrdenDeTrabajoDTO[]> {
    return this.http.get<OrdenDeTrabajoDTO[]>(`${this.apiUrl}/GetAllOrdenesDeTrabajo`, this.httpOptions);
  }

  // Obtener orden por ID
  getById(id: number): Observable<OrdenDeTrabajoDTO> {
    return this.http.get<OrdenDeTrabajoDTO>(`${this.apiUrl}/GetOrdenDeTrabajoById/${id}`, this.httpOptions);
  }

  // Crear orden
  create(orden: OrdenDeTrabajoDTO): Observable<OrdenDeTrabajoDTO> {
    return this.http.post<OrdenDeTrabajoDTO>(`${this.apiUrl}/CreateOrdenDeTrabajo`, orden, this.httpOptions);
  }

  // Actualizar orden
  update(orden: OrdenDeTrabajoDTO): Observable<OrdenDeTrabajoDTO> {
    return this.http.post<OrdenDeTrabajoDTO>(`${this.apiUrl}/UpdateOrdenDeTrabajo`, orden, this.httpOptions);
  }

  // Eliminar orden
  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/DeleteOrdenDeTrabajo/${id}`, this.httpOptions);
  }

  // Establecer fecha fin de reparación (según tu backend actual)
  establecerFechaFin(id: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/EstablecerFechaFinInReparacion/${id}`, null, this.httpOptions);
  }

  // 🚀 Cambiar estado de una orden (requiere implementación en backend)
  updateEstado(id: number, nuevoEstado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateEstadoOrdenDeTrabajo/${id}/${nuevoEstado}`, null, this.httpOptions);
  }
}

