import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AggregatedUser } from '../models/aggregated-user.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // URL do seu Backend Spring Boot
  private apiUrl = 'http://localhost:8080/users';

  getAllUsers(): Observable<AggregatedUser[]> {
    return this.http.get<AggregatedUser[]>(this.apiUrl);
  }
}
