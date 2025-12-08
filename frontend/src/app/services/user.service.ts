// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // URL da API Spring Boot
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  // Busca usuários com filtro opcional de banco (source)
  getUsers(source?: string): Observable<User[]> {
    let params = new HttpParams();
    if (source) {
      params = params.set('source', source);
    }
    return this.http.get<User[]>(this.apiUrl, { params });
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Busca detalhes agregados de um usuário específico
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}
