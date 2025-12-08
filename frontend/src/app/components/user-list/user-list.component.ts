import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  selectedSource: string = '';
  loading = false;
  showModal = false;
  editingUser: User | null = null;

  // Form data
  formData: User = {
    userId: '',
    email: '',
    password: '',
    age: undefined,
    country: '',
    genres: []
  };
  genresInput: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers(this.selectedSource).subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar usuários', error);
        this.loading = false;
        alert('Erro ao carregar usuários. Verifique o console.');
      }
    });
  }

  onFilterChange(source: string): void {
    this.selectedSource = source;
    this.loadUsers();
  }

  isSavedIn(user: User, db: string): boolean {
    return user.savedIn?.includes(db) ?? false;
  }

  // ==================== CRUD ====================

  openCreateModal(): void {
    this.editingUser = null;
    this.formData = {
      userId: 'user_' + Date.now(),
      email: '',
      password: '',
      age: undefined,
      country: '',
      genres: []
    };
    this.genresInput = '';
    this.showModal = true;
  }

  openEditModal(user: User): void {
    this.editingUser = user;
    this.formData = {
      userId: user.userId,
      email: user.email || '',
      password: '', // Não mostramos senha na edição
      age: user.age,
      country: user.country,
      genres: user.genres || []
    };
    this.genresInput = user.genres?.join(', ') || '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
  }

  saveUser(): void {
    // Processa gêneros
    if (this.genresInput.trim()) {
      this.formData.genres = this.genresInput.split(',').map(g => g.trim());
    }

    if (this.editingUser) {
      // UPDATE
      this.userService.updateUser(this.formData.userId!, this.formData).subscribe({
        next: () => {
          alert('Usuário atualizado com sucesso!');
          this.closeModal();
          this.loadUsers();
        },
        error: (error: any) => {
          console.error('Erro ao atualizar', error);
          alert('Erro ao atualizar usuário. Verifique o console.');
        }
      });
    } else {
      // CREATE
      this.userService.createUser(this.formData).subscribe({
        next: () => {
          alert('Usuário criado com sucesso!');
          this.closeModal();
          this.loadUsers();
        },
        error: (error: any) => {
          console.error('Erro ao criar', error);
          alert('Erro ao criar usuário. Verifique o console.');
        }
      });
    }
  }

  deleteUser(userId: string): void {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${userId}?`)) {
      return;
    }

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        alert('Usuário excluído com sucesso!');
        this.loadUsers();
      },
      error: (error: any) => {
        console.error('Erro ao excluir', error);
        alert('Erro ao excluir usuário. Verifique o console.');
      }
    });
  }
}
