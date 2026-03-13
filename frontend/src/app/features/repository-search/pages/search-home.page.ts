import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchFormComponent } from '../components/search-form.component';

@Component({
  selector: 'app-search-home-page',
  standalone: true,
  imports: [SearchFormComponent],
  template: `
    <main class="search-home-page">
      <section class="search-home-hero">
        <p class="search-home-badge">Notro Challenge</p>
        <h1>Encontre resultados no estilo GitHub Search</h1>
        <p class="search-home-subtitle">
          Pesquise repositories, code, users, commits e muito mais com uma interface moderna, fluida e focada em usabilidade.
        </p>

        <div class="search-home-form">
          <app-search-form
            [label]="'Search GitHub'"
            [placeholder]="'Search GitHub (ex.: node, angular language:typescript)'"
            [buttonLabel]="'Search'"
            (searchSubmit)="onSearch($event)"
          />
        </div>

        <p class="search-home-tip">
          Tip: para busca avancada, use prefixos como <code>language:typescript</code>, <code>stars:>1000</code> e <code>topic:nodejs</code>.
        </p>
      </section>
    </main>
  `
})
export class SearchHomePageComponent {
  constructor(private readonly router: Router) {}

  onSearch(query: string) {
    this.router.navigate(['/search'], {
      queryParams: { q: query, type: 'repositories', page: 1 }
    });
  }
}
