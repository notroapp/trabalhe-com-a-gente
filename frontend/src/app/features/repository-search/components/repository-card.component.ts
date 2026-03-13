import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import type { RepositorySummary } from '../models/repository-search.models';

@Component({
  selector: 'app-repository-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './repository-card.component.html'
})
export class RepositoryCardComponent {
  @Input({ required: true }) repository!: RepositorySummary;

  get descriptionText(): string {
    return this.repository.description || 'Sem descrição informada.';
  }

  get safeUrl(): string {
    const value = this.repository.url?.trim();
    if (!value) return '#';
    return value.startsWith('http://') || value.startsWith('https://') ? value : '#';
  }
}
