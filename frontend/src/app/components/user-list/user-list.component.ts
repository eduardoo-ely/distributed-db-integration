import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- Necessário em Standalone
import { UserService } from '../../services/user.service'; // Confirme se o arquivo é este
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  selectedSource: string = '';
  loading = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers(this.selectedSource).subscribe({
      next: (data: User[]) => { // Tipagem explícita para evitar erro de 'any'
        this.users = data;
        this.loading = false;
      },
      error: (error: any) => { // Tipagem explícita
        console.error('Erro ao carregar', error);
        this.loading = false;
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
}
