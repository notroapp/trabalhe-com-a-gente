/* eslint-env vitest */

import { render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { vi } from 'vitest';
import {UseSearchRepository} from './UseSearchRepository.controllers.jsx';

vi.mock('../models/GitHubAPI.model.jsx', () => ({
  fetchGitHubRepositories: vi.fn(),
}));

import { fetchGitHubRepositories } from '../models/GitHubAPI.model.jsx';

const TestComponent = ({ query, option, page, perPage }) => {
  const { data, loading, error } = UseSearchRepository(query, option, page, perPage);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <p>Total: {data.total_count}</p>
      <ul>
        {data.items.map(item => (
          <li key={item.id}>{item.full_name}</li>
        ))}
      </ul>
    </div>
  );
};

describe('UseSearchRepository hook', () => {
  beforeEach(() => {
    fetchGitHubRepositories.mockReset();
  });

  it('should display loading and data', async () => {
    const fakeData = {
      total_count: 2,
      items: [
        { id: 1, full_name: 'repo1' },
        { id: 2, full_name: 'repo2' },
      ],
    };
    fetchGitHubRepositories.mockResolvedValue(fakeData);

    render(<TestComponent query="react" option="stars" page={1} perPage={5} />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Total: 2')).toBeInTheDocument();
      expect(screen.getByText('repo1')).toBeInTheDocument();
      expect(screen.getByText('repo2')).toBeInTheDocument();
    });
  });

  it('should display error on fetch failure', async () => {
    fetchGitHubRepositories.mockRejectedValue(new Error('Falha na rede'));

    render(<TestComponent query="react" option="stars" page={1} perPage={5} />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Erro:/)).toHaveTextContent('Erro: Falha na rede');
    });
  });
});
