import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { UserDTO, UserLog, NetworkResponse } from '../models/data.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private auth: AuthService) {
    console.log('🔧 DashboardService inicializado');
  }

  private getHeaders() {
    const token = this.auth.getToken();

    if (!token) {
      console.warn('⚠️ getHeaders chamado sem token!');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return { headers };
  }

  // Busca dados agregados de todos os bancos
  getUserProfile(userId: string = 'me'): Observable<UserDTO> {
    const url = `${this.apiUrl}/users/${userId}`;
    console.log('📡 GET getUserProfile:', url);

    return this.http.get<UserDTO>(url, this.getHeaders()).pipe(
      tap(response => {
        console.log('✅ getUserProfile SUCCESS:', response);
      }),
      catchError(error => {
        console.error('❌ getUserProfile ERROR:', error);
        console.error('   URL:', url);
        console.error('   Status:', error.status);
        console.error('   Message:', error.message);
        return throwError(() => error);
      })
    );
  }

  // Logs (MongoDB simulado via controller)
  getLogs(userId: string = 'me'): Observable<UserLog[]> {
    const url = `${this.apiUrl}/logs/${userId}`;
    console.log('📡 GET getLogs:', url);

    return this.http.get<UserLog[]>(url, this.getHeaders()).pipe(
      tap(response => {
        console.log('✅ getLogs SUCCESS:', response);
      }),
      catchError(error => {
        console.error('❌ getLogs ERROR:', error);
        return throwError(() => error);
      })
    );
  }

  // Network (Neo4j)
  getNetwork(userId: string = 'me'): Observable<NetworkResponse> {
    const url = `${this.apiUrl}/network/${userId}`;
    console.log('📡 GET getNetwork:', url);

    return this.http.get<NetworkResponse>(url, this.getHeaders()).pipe(
      tap(response => {
        console.log('✅ getNetwork SUCCESS:', response);
      }),
      catchError(error => {
        console.error('❌ getNetwork ERROR:', error);
        return throwError(() => error);
      })
    );
  }

  // Incrementa login no Redis
  incrementLogin(userId: string): Observable<any> {
    const url = `${this.apiUrl}/users/${userId}/login`;
    console.log('📡 POST incrementLogin:', url);

    return this.http.post(url, {}, this.getHeaders()).pipe(
      tap(response => {
        console.log('✅ incrementLogin SUCCESS:', response);
      }),
      catchError(error => {
        console.error('❌ incrementLogin ERROR:', error);
        return throwError(() => error);
      })
    );
  }
}
