import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import type { IssueSummary } from '../models/repository-search.models';

@Component({
  selector: 'app-issues-list',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <section class="results" role="region" aria-label="Resultados de issues" aria-live="polite">
      @if (loading) {
        <p role="status">Carregando issues...</p>
      } @else if (error) {
        <p role="alert">{{ error }}</p>
      } @else if (showEmpty) {
        <p role="status">Nenhuma issue encontrada para este repositorio.</p>
      } @else {
        @for (issue of items; track issue.id) {
          <mat-card class="repo-card">
            <mat-card-title>{{ issue.title }}</mat-card-title>
            <mat-card-content>
              <p>Repositorio: {{ issue.repositoryFullName }}</p>
              <p>Autor: {{ issue.authorLogin }}</p>
              <p>Estado: {{ issue.state }}</p>
              <p>Comentarios: {{ issue.commentsCount }}</p>
              <a [href]="issue.url" target="_blank" rel="noopener noreferrer">Abrir issue no GitHub</a>
            </mat-card-content>
          </mat-card>
        }
      }
    </section>
  `
})
export class IssuesListComponent {
  @Input() items: IssueSummary[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() showEmpty = false;
}
