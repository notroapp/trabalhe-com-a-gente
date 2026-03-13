import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/repository-search/repository-search.routes').then((m) => m.REPOSITORY_SEARCH_ROUTES)
  }
];
