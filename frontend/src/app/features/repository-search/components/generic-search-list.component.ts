import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import type { GithubSearchItem } from '../models/repository-search.models';

@Component({
  selector: 'app-generic-search-list',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <section class="results" role="region" aria-label="Resultados da busca" aria-live="polite">
      @if (loading) {
        <div class="state-box state-loading" role="status">
          <p>Carregando resultados...</p>
        </div>
        @for (placeholder of skeletons; track placeholder) {
          <div class="repo-card skeleton-card" aria-hidden="true">
            <div class="skeleton-line skeleton-title"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
            <div class="skeleton-meta">
              <span class="skeleton-pill"></span>
              <span class="skeleton-pill"></span>
              <span class="skeleton-pill"></span>
            </div>
          </div>
        }
      } @else if (error) {
        <div class="state-box state-error" role="alert">
          <div class="state-icon">!</div>
          <div>
            <strong>Falha ao carregar resultados.</strong>
            <p>{{ error }}</p>
            <p class="state-hint">Tente novamente ou refine sua busca.</p>
          </div>
        </div>
      } @else if (showEmpty) {
        <div class="state-box state-empty" role="status">
          <div class="state-icon">i</div>
          <div>
            <strong>Nenhum resultado encontrado.</strong>
            <p>Termo: <strong>{{ query }}</strong></p>
            <p class="state-hint">Dica: combine filtros como <code>language:typescript</code> e <code>stars:>100</code>.</p>
          </div>
        </div>
      } @else {
        @for (item of items; track item.id) {
          <mat-card class="repo-card">
            <mat-card-title>
              <a class="repo-title-link" [href]="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
            </mat-card-title>
            <mat-card-content>
              @if (item.subtitle) {
                <p class="repo-description">{{ item.subtitle }}</p>
              }
              @if (item.description) {
                <p class="repo-description">{{ item.description }}</p>
              }
              <div class="repo-meta">
                @if (item.state) {
                  <span class="repo-pill">{{ item.state }}</span>
                }
                @if (item.author) {
                  <span class="repo-pill">Autor {{ item.author }}</span>
                }
                @if (item.repository) {
                  <span class="repo-pill">{{ item.repository }}</span>
                }
              </div>
              <a class="repo-link" [href]="item.url" target="_blank" rel="noopener noreferrer">Abrir no GitHub</a>
            </mat-card-content>
          </mat-card>
        }
      }
    </section>
  `
})
export class GenericSearchListComponent {
  @Input() items: GithubSearchItem[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() showEmpty = false;
  @Input() query = '';

  readonly skeletons = Array.from({ length: 5 }, (_, index) => index);
}
