import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Presupuesto } from '../models/presupuesto';
import { Reparacion } from '../models/reparacion';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {

  private apiUrl = 'http://localhost:3307/presupuesto';

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4='
    })
  };

  constructor(private http: HttpClient) {}


  crearPresupuesto(data:any ): Observable<any> {
  return this.http.post(`${this.apiUrl}/CreatePresupuesto`, data, {

    headers: this.httpOptions.headers
  });
}
  getAll(): Observable<Presupuesto[]> {
    return this.http.get<Presupuesto[]>(`${this.apiUrl}/GetAllPresupuestos`, this.httpOptions);
  }
  findAllByAceptadoTrue(): Observable<Presupuesto[]> {
    return this.http.get<Presupuesto[]>(`${this.apiUrl}/FindAllByAceptadoTrue`, this.httpOptions);
  }

  getById(id: number): Observable<Presupuesto> {
    return this.http.get<Presupuesto>(`${this.apiUrl}/GetPresupuestoById/${id}`, this.httpOptions);
  }



  update(presupuesto: Presupuesto): Observable<Presupuesto> {
    return this.http.put<Presupuesto>(`${this.apiUrl}/UpdatePresupuesto`, presupuesto, this.httpOptions);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeletePresupuesto/${id}`, this.httpOptions);
  }
}



