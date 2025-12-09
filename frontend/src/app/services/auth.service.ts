import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/data.model';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private tokenKey = 'auth_token';
  private userIdKey = 'auth_user_id';

  constructor() { }

  login(token: string, userId: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userIdKey, userId);
    }
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userIdKey); // <--- Limpa ID
    }
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getUserId(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.userIdKey);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
