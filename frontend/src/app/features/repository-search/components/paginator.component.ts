import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { PaginationMetadata } from '../models/repository-search.models';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <div class="paginator" role="navigation" aria-label="Paginacao de resultados">
      <button
        mat-stroked-button
        type="button"
        aria-label="Pagina anterior"
        (click)="previous()"
        [disabled]="disabled || !pagination.hasPreviousPage"
      >
        Anterior
      </button>
      <span aria-live="polite">Pagina {{ pagination.page }} de {{ totalPages }}</span>
      <button
        mat-stroked-button
        type="button"
        aria-label="Proxima pagina"
        (click)="next()"
        [disabled]="disabled || !pagination.hasNextPage"
      >
        Proxima
      </button>
    </div>
  `
})
export class PaginatorComponent {
  @Input({ required: true }) pagination!: PaginationMetadata;
  @Input() disabled = false;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.pagination.totalCount / this.pagination.perPage));
  }

  next() {
    this.pageChange.emit(this.pagination.page + 1);
  }

  previous() {
    this.pageChange.emit(this.pagination.page - 1);
  }
}
