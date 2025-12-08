import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.username || !this.password) {
      this.error = 'Preencha todos os campos';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        console.log('✅ Login bem-sucedido:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Erro no login:', err);
        this.error = 'Email ou senha inválidos';
        this.loading = false;
      }
    });
  }

  // Credenciais de teste
  fillTestCredentials() {
    this.username = 'admin@admin.com';
    this.password = '123456';
  }
}
