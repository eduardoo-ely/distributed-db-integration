import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  // ==================== CRUD ====================
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  getUsers(source?: string): Observable<User[]> {
    let params = new HttpParams();
    if (source) {
      params = params.set('source', source);
    }
    return this.http.get<User[]>(this.apiUrl, { params });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ==================== RELACIONAMENTOS ====================

  followUser(followerId: string, followedId: string): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/${followerId}/follow/${followedId}`,
      {}
    );
  }

  // ==================== UTILIDADES ====================

  incrementLogin(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/login`, {});
  }
}
