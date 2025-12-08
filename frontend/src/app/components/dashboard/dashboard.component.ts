import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { UserProfile, UserLog, UserConnection } from '../../models/data.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">

      <div *ngIf="profile" class="section postgres-box">
        <h1>Olá, {{ profile.fullName }}</h1>
        <p>Email: {{ profile.email }} (PostgreSQL)</p>
      </div>

      <div *ngIf="!profile">Carregando perfil...</div>

      <div class="grid" *ngIf="profile">

        <div class="card mongo-box">
          <h3>📜 Histórico (MongoDB)</h3>
          <ul>
            <li *ngFor="let log of logs">
              {{ log.action }} <small>{{ log.timestamp }}</small>
            </li>
          </ul>
          <p *ngIf="logs.length === 0">Sem logs.</p>
        </div>

        <div class="card neo4j-box">
          <h3>🕸️ Rede (Neo4j)</h3>
          <div *ngFor="let conn of connections" class="badge">
            {{ conn.targetUser }} ({{ conn.relationType }})
          </div>
          <p *ngIf="connections.length === 0">Sem conexões.</p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; font-family: sans-serif; }
    .section { padding: 20px; border-radius: 8px; margin-bottom: 20px; color: white; }
    .postgres-box { background: #336791; } /* Azul Postgres */

    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .card { padding: 15px; border: 1px solid #ddd; border-radius: 8px; }

    .mongo-box { border-top: 5px solid #47A248; } /* Verde Mongo */
    .neo4j-box { border-top: 5px solid #008CC1; } /* Azul Neo4j */

    .badge { display: inline-block; background: #eee; padding: 5px 10px; margin: 5px; border-radius: 15px; }
  `]
})
export class DashboardComponent implements OnInit {
  profile: UserProfile | null = null;
  logs: UserLog[] = [];
  connections: UserConnection[] = [];

  constructor(private dashService: DashboardService) {}

  ngOnInit() {
    // 1. Carrega Perfil (Prioridade)
    this.dashService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;

        // 2. Só agora busca o resto (Performance/Lógica)
        this.loadDistributedData();
      }
    });
  }

  loadDistributedData() {
    this.dashService.getLogs().subscribe(data => this.logs = data);
    this.dashService.getConnections().subscribe(data => this.connections = data);
  }
}
