import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompaniaAseguradora } from '../models/compania-aseguradora';

@Injectable({
  providedIn: 'root'
})
export class CompaniaAseguradoraService {

  private baseUrl = 'http://localhost:3307/companiaAseguradora';


  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4='
    })
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<CompaniaAseguradora[]> {
    return this.http.get<CompaniaAseguradora[]>(`${this.baseUrl}/GetAllCompaniasAseguradoras`, this.httpOptions);
  }

  add(compania: CompaniaAseguradora): Observable<CompaniaAseguradora> {
    return this.http.post<CompaniaAseguradora>(`${this.baseUrl}/CreateCompaniaAseguradora`, compania, this.httpOptions);
  }

  update(compania: CompaniaAseguradora): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/UpdateCompaniaAseguradora/${compania.id}`, compania, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/DeleteCompaniaAseguradora/${id}`, this.httpOptions);
  }
}

