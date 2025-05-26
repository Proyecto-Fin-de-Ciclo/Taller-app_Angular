import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trabajador } from '../../core/models/trabajador';

@Injectable({
  providedIn: 'root',
})
export class TrabajadorService {
  private baseUrl = 'http://localhost:3307/trabajador';

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4=' // sustituye esta cadena si usas otra credencial
    }),
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(`${this.baseUrl}/GetAllTrabajadores`, this.httpOptions);
  }

  getById(id: number): Observable<Trabajador> {
    return this.http.get<Trabajador>(`${this.baseUrl}/GetTrabajadorById/${id}`, this.httpOptions);
  }

  getImagen(nombreArchivo: string): string {
  return `http://localhost:3307/imagen/${nombreArchivo}`;
  }

  uploadImagen(formData: FormData): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/uploadImagen`, formData, this.httpOptions);
}


  create(trabajador: Trabajador): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/CreateTrabajador`, trabajador, this.httpOptions);
  }

  update(trabajador: Trabajador): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/UpdateTrabajador`, trabajador, this.httpOptions);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/DeleteTrabajador/${id}`, this.httpOptions);
  }
}
