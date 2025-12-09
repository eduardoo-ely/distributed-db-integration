import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    // 1. Validação básica
    if (!this.username || !this.password) {
      this.error = 'Preencha todos os campos';
      return;
    }

    this.loading = true;
    this.error = '';

    // 2. Monta o objeto para enviar (O Backend aceita 'email' ou 'username')
    const loginData = {
      email: this.username,
      password: this.password
    };

    // 3. Faz a chamada ao Backend
    this.http.post('http://localhost:8080/api/auth/login', loginData).subscribe({
      next: (response: any) => {
        console.log('✅ Login bem-sucedido:', response);

        // 4. Salva Token e UserID no AuthService
        this.authService.login(response.token, response.userId);

        // 5. Redireciona para o Dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Erro no login:', err);
        this.error = 'Email ou senha inválidos';
        this.loading = false;
      }
    });
  }

  fillTestCredentials() {
    this.username = 'admin@admin.com';
    this.password = '123456';
  }
}
