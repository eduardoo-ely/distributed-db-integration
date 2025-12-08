import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importante para usar ngModel
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importar módulos aqui!
  template: `
    <div class="login-container">
      <h2>Acesso ao Sistema</h2>
      <input [(ngModel)]="username" placeholder="Usuário" />
      <input [(ngModel)]="password" type="password" placeholder="Senha" />
      <button (click)="onLogin()">Entrar</button>
    </div>
  `,
  styles: [`
    .login-container { max-width: 300px; margin: 50px auto; display: flex; flex-direction: column; gap: 10px; }
    input { padding: 10px; }
    button { padding: 10px; background: #007bff; color: white; border: none; cursor: pointer; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => alert('Login falhou!')
    });
  }
}
