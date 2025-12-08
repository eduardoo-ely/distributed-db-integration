import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { AggregatedUser } from './models/aggregated-user.model';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  apiService = inject(ApiService);
  users: AggregatedUser[] = [];
  isLoading = true;

  // Referência ao elemento DIV onde o grafo será desenhado
  @ViewChild('networkGraph', { static: true }) networkGraph!: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
        // Assim que os dados chegam, renderizamos o grafo
        this.renderGraph(data);
      },
      error: (err) => {
        console.error('Erro ao conectar com API Java:', err);
        this.isLoading = false;
      }
    });
  }

  renderGraph(users: AggregatedUser[]) {
    const nodes = new DataSet<any>();
    const edges = new DataSet<any>();

    users.forEach(u => {
      // 1. Criar um NÓ para cada usuário
      nodes.add({
        id: u.userId,
        label: `User ${u.userId}\n(${u.profile?.country || 'N/A'})`,
        shape: 'dot',
        color: '#ffc107', // Amarelo (Neo4j)
        font: { color: 'black', size: 14 },
        size: 20
      });

      // 2. Criar ARESTAS baseadas em quem o usuário segue
      if (u.relations && u.relations.following) {
        u.relations.following.forEach(targetId => {
          // Só cria a seta se o usuário alvo também estiver na lista (para evitar erros)
          if (users.find(user => user.userId === targetId)) {
            edges.add({
              from: u.userId,
              to: targetId,
              arrows: 'to',
              color: { color: '#adb5bd' } // Cinza para a linha
            });
          }
        });
      }
    });

    // Configuração do Vis.js
    const data = { nodes, edges };
    const options = {
      physics: {
        enabled: true,
        stabilization: false,
        barnesHut: {
          gravitationalConstant: -2000,
          springConstant: 0.04
        }
      },
      interaction: { hover: true },
      layout: { randomSeed: 2 } // Para o grafo ficar sempre igual
    };

    new Network(this.networkGraph.nativeElement, data, options);
  }
}
