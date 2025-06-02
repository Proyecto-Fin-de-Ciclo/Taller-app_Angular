import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3307/user';

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Basic YWRtaW46YWRtaW4='
    }),
  };

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/GetAllUsers`, this.httpOptions);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/GetUserById/${id}`, this.httpOptions);
  }

  getByDni(dni: string): Observable<User> {
  return this.http.get<User>(`${this.baseUrl}/GetUserByDni/${dni}`, this.httpOptions);
}

  create(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/CreateUser`, user, this.httpOptions);
  }

  update(user: User): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/UpdateUser`, user, this.httpOptions);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/DeleteUser/${id}`, this.httpOptions);
  }
}

