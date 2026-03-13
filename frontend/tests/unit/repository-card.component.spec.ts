import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { RepositoryCardComponent } from '../../src/app/features/repository-search/components/repository-card.component';

describe('RepositoryCardComponent', () => {
  it('exposes required field values and fallback description', () => {
    const component = new RepositoryCardComponent();
    component.repository = {
      id: '1',
      name: 'angular',
      url: 'https://github.com/angular/angular',
      description: null,
      watchersCount: 2000,
      starsCount: 90000,
      openIssuesCount: 1200,
      ownerLogin: 'angular'
    };

    expect(component.repository.name).toBe('angular');
    expect(component.repository.watchersCount).toBe(2000);
    expect(component.repository.starsCount).toBe(90000);
    expect(component.repository.openIssuesCount).toBe(1200);
    expect(component.repository.ownerLogin).toBe('angular');
    expect(component.descriptionText).toBe('Sem descrição informada.');
    expect(component.safeUrl).toBe('https://github.com/angular/angular');
  });

  it('sanitizes invalid external url', () => {
    const component = new RepositoryCardComponent();
    component.repository = {
      id: '1',
      name: 'test',
      url: 'javascript:alert(1)',
      description: null,
      watchersCount: 0,
      starsCount: 0,
      openIssuesCount: 0,
      ownerLogin: 'owner'
    };

    expect(component.safeUrl).toBe('#');
  });
});
