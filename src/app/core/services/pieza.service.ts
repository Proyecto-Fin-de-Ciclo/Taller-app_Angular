import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pieza } from '../../core/models/pieza';

@Injectable({
  providedIn: 'root'
})
export class PiezaService {

  private baseUrl = 'http://localhost:3307/pieza';

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4='
    })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<Pieza[]> {
    return this.http.get<Pieza[]>(`${this.baseUrl}/GetAllPiezas`, this.httpOptions);
  }

  add(pieza: Pieza): Observable<Pieza> {
    return this.http.post<Pieza>(`${this.baseUrl}/CreatePieza`, pieza, this.httpOptions);
  }

  update(pieza: Pieza): Observable<Pieza> {
    return this.http.put<Pieza>(`${this.baseUrl}/UpdatePieza/${pieza.id}`, pieza, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/DeletePieza/${id}`, this.httpOptions);
  }
}
