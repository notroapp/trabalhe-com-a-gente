import { Routes } from '@angular/router';
import { RepositorySearchPageComponent } from './pages/repository-search.page';
import { SearchHomePageComponent } from './pages/search-home.page';

export const REPOSITORY_SEARCH_ROUTES: Routes = [
  {
    path: '',
    component: SearchHomePageComponent
  },
  {
    path: 'search',
    component: RepositorySearchPageComponent
  }
];
