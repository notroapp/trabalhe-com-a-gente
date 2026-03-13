import { Component, Input } from '@angular/core';
import type { RepositorySummary } from '../models/repository-search.models';
import { RepositoryCardComponent } from './repository-card.component';

@Component({
  selector: 'app-repository-list',
  standalone: true,
  imports: [RepositoryCardComponent],
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
            <strong>Nenhum repositório encontrado.</strong>
            <p>Termo: <strong>{{ query }}</strong></p>
            <p class="state-hint">Dica: use filtros como <code>language:typescript</code> ou <code>stars:>100</code>.</p>
          </div>
        </div>
      } @else {
        @for (repo of items; track repo.id) {
          <app-repository-card [repository]="repo" />
        }
      }
    </section>
  `
})
export class RepositoryListComponent {
  @Input() items: RepositorySummary[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() showEmpty = false;
  @Input() query = '';

  readonly skeletons = Array.from({ length: 5 }, (_, index) => index);
}
