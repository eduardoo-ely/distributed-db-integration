import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

// Interfaces
interface UserDTO {
  userId: string;
  email: string;
  age?: number;
  country?: string;
  genres?: string[];
  loginCount?: number;
  followingIds?: string[];
  savedIn?: string[];
}

interface UserLog {
  timestamp: string;
  action: string;
  user?: string;
  system?: string;
}

interface NetworkResponse {
  nodes: Array<{id: string; group: string}>;
  links: Array<{source: string; target: string}>;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: UserDTO | null = null;
  logs: UserLog[] = [];
  network: NetworkResponse | null = null;
  loading = true;
  error = '';

  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadDataDirectly();
  }

  loadDataDirectly() {
    const token = this.authService.getToken();
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 1. Carrega User
    this.http.get<UserDTO>(`${this.apiUrl}/users/me`, { headers }).subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar usuário:', err);
        this.error = `Erro: ${err.status} - ${err.message}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    // 2. Carrega Logs
    this.http.get<UserLog[]>(`${this.apiUrl}/logs/me`, { headers }).subscribe({
      next: (data) => {
        this.logs = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar logs:', err);
        this.logs = [];
      }
    });

    // 3. Carrega Network
    this.http.get<NetworkResponse>(`${this.apiUrl}/network/me`, { headers }).subscribe({
      next: (data) => {
        this.network = data || { nodes: [], links: [] };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar network:', err);
        this.network = { nodes: [], links: [] };
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  hasDataFrom(dbName: string): boolean {
    return this.user?.savedIn?.includes(dbName) || false;
  }

  formatTimestamp(timestamp: string): string {
    try {
      return new Date(timestamp).toLocaleString('pt-BR');
    } catch (e) {
      return timestamp;
    }
  }

  getNodeColor(group: string): string {
    return group === 'me' ? '#0d6efd' : '#6c757d';
  }
}
