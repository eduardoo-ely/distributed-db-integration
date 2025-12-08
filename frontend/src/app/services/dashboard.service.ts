import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, UserLog, UserConnection } from '../models/data.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.auth.getToken()}` })
    };
  }

  // 1. PostgreSQL (Rápido/Estruturado)
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/users/me`, this.getHeaders());
  }

  // 2. MongoDB (Logs)
  getLogs(): Observable<UserLog[]> {
    return this.http.get<UserLog[]>(`${this.apiUrl}/logs/me`, this.getHeaders());
  }

  // 3. Neo4j (Grafo)
  getConnections(): Observable<UserConnection[]> {
    return this.http.get<UserConnection[]>(`${this.apiUrl}/network/me`, this.getHeaders());
  }
}
