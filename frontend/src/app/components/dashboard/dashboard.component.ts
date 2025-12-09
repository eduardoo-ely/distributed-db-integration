import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

// Interfaces
interface UserDTO {
  userId: string;
  email: string;
  password?: string;
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
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: UserDTO | null = null;
  logs: UserLog[] = [];
  network: NetworkResponse | null = null;
  currentUserId: string = '';

  allUsers: UserDTO[] = [];
  editingUser: UserDTO | null = null;
  editGenresInput: string = '';
  showEditModal: boolean = false;

  newUser: UserDTO = {
    userId: '',
    email: '',
    password: '',
    age: 18,
    country: 'Brazil',
    genres: []
  };
  genresInput: string = '';

  myFollowingSet = new Set<string>();

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
    const storedId = this.authService.getUserId();

    if (!token || !storedId) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUserId = storedId;

    this.loadDataDirectly();
    this.loadAllUsers();
  }

  // ==========================================
  // CARREGAR DADOS DO USUÁRIO ATUAL
  // ==========================================
  loadDataDirectly() {
    const token = this.authService.getToken();
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 1. Carrega User
    this.http.get<UserDTO>(`${this.apiUrl}/users/${this.currentUserId}`, { headers }).subscribe({
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
    this.http.get<UserLog[]>(`${this.apiUrl}/logs/${this.currentUserId}`, { headers }).subscribe({
      next: (data) => this.logs = data || [],
      error: () => this.logs = []
    });

    // 3. Carrega Network e atualiza quem eu sigo
    this.http.get<NetworkResponse>(`${this.apiUrl}/network/${this.currentUserId}`, { headers }).subscribe({
      next: (data) => {
        this.network = data || { nodes: [], links: [] };

        // Atualiza lista de quem eu sigo para os botões da tabela
        this.myFollowingSet.clear();
        if (this.network.links) {
          this.network.links.forEach(link => {
            if (link.source === this.currentUserId) {
              this.myFollowingSet.add(link.target);
            }
          });
        }

        this.cdr.detectChanges();
      },
      error: () => this.network = { nodes: [], links: [] }
    });
  }

  // ==========================================
  // CRUD - LEITURA E CRIAÇÃO
  // ==========================================

  loadAllUsers() {
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<UserDTO[]>(`${this.apiUrl}/users`, { headers }).subscribe({
      next: (data) => {
        this.allUsers = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao listar:', err)
    });
  }

  createUser() {
    if (!this.newUser.userId || !this.newUser.email || !this.newUser.password) {
      alert('Por favor, preencha ID, Email e Senha!');
      return;
    }

    if (this.genresInput) {
      this.newUser.genres = this.genresInput.split(',').map(g => g.trim()).filter(g => g !== '');
    } else {
      this.newUser.genres = [];
    }

    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.post<UserDTO>(`${this.apiUrl}/users`, this.newUser, { headers }).subscribe({
      next: (createdUser) => {
        alert(`Usuário "${createdUser.userId}" criado com sucesso!`);
        this.newUser = { userId: '', email: '', password: '', age: 18, country: 'Brazil', genres: [] };
        this.genresInput = '';
        this.loadAllUsers();
      },
      error: (err) => alert('Erro ao criar usuário: ' + (err.error?.message || err.message))
    });
  }

  // ==========================================
  // CRUD - ATUALIZAÇÃO (UPDATE - MODAL)
  // ==========================================

  startEdit(user: UserDTO) {
    this.editingUser = { ...user }; // Clona para não editar na tabela
    this.editingUser.password = ''; // Limpa senha
    this.editGenresInput = user.genres ? user.genres.join(', ') : '';
    this.showEditModal = true;
  }

  cancelEdit() {
    this.editingUser = null;
    this.showEditModal = false;
  }

  // -- UPDATE (Salvar Edição) --
  saveEdit() {
    if (!this.editingUser) return;

    // Processa os gêneros da string para array
    if (this.editGenresInput) {
      this.editingUser.genres = this.editGenresInput.split(',').map(g => g.trim()).filter(g => g !== '');
    } else {
      this.editingUser.genres = [];
    }

    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.put<UserDTO>(`${this.apiUrl}/users/${this.editingUser.userId}`, this.editingUser, { headers }).subscribe({
      next: (updatedUser) => {
        alert('Dados atualizados com sucesso!');

        // Atualiza a lista geral
        this.loadAllUsers();

        // Se eu editei a mim mesmo, atualiza meu card de perfil
        if (updatedUser.userId === this.currentUserId) {
          this.loadDataDirectly();
        }

        this.cancelEdit();
      },
      error: (err) => alert('Erro ao atualizar: ' + (err.error?.message || err.message))
    });
  }

  // ==========================================
  // CRUD - REMOÇÃO (DELETE)
  // ==========================================

  deleteUser(id: string) {
    if (!confirm(`ATENÇÃO: Tem certeza que deseja apagar o usuário "${id}"?`)) {
      return;
    }

    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.delete(`${this.apiUrl}/users/${id}`, { headers }).subscribe({
      next: () => {
        alert('Usuário deletado com sucesso!');
        this.loadAllUsers();
        if (this.currentUserId === id) {
          this.logout();
        }
      },
      error: (err) => alert('Erro ao deletar: ' + err.message)
    });
  }

  // ==========================================
  // CONEXÕES (NEO4J)
  // ==========================================

  isFollowing(targetId: string): boolean {
    return this.myFollowingSet.has(targetId);
  }

  // CONECTAR
  followUser(targetId: string) {
    if (!this.currentUserId || targetId === this.currentUserId) return;

    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.post(`${this.apiUrl}/users/${this.currentUserId}/follow/${targetId}`, {}, { headers }).subscribe({
      next: () => {
        this.myFollowingSet.add(targetId);
        this.cdr.detectChanges();

        this.loadDataDirectly();
      },
      error: (err) => {
        console.error(err);
        this.loadDataDirectly();
      }
    });
  }

  // DESCONECTAR
  unfollowUser(targetId: string) {
    if (!this.currentUserId) return;

    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.delete(`${this.apiUrl}/users/${this.currentUserId}/follow/${targetId}`, { headers }).subscribe({
      next: () => {
        this.myFollowingSet.delete(targetId);
        this.cdr.detectChanges();

        this.loadDataDirectly();
      },
      error: (err) => alert('Erro ao desconectar: ' + (err.error?.message || err.message))
    });
  }

  // ==========================================
  // UTILITÁRIOS
  // ==========================================
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
