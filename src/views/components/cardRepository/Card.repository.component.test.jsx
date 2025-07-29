/* eslint-env vitest */

import { render, screen, fireEvent } from '@testing-library/react';
import CardRepository from './Card.repository.component.jsx';

describe('CardRepository Component', () => {
  const repoProps = {
    id: 1,
    name: 'facebook/react',
    url: 'https://github.com/facebook/react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    stars: 200000,
    watchers: 5000,
    forks: 40000,
    issues: 800,
    language: 'JavaScript',
    license: 'MIT',
    date: '2023-07-25T00:00:00Z',
    isFavorited: false,
    toggleFavorite: vi.fn(),
  };

  it('renders repository info correctly', () => {
    render(<CardRepository {...repoProps} />);

    expect(screen.getByText(repoProps.name)).toBeInTheDocument();
    expect(screen.getByText(repoProps.description)).toBeInTheDocument();
    expect(screen.getByText(/Estrelas:/)).toHaveTextContent(`Estrelas: ${repoProps.stars}`);
    expect(screen.getByText(/Linguagem:/)).toHaveTextContent(`Linguagem: ${repoProps.language}`);
  });

  it('calls toggleFavorite when button clicked', () => {
    render(<CardRepository {...repoProps} />);
    const button = screen.getByRole('button', { name: /Adicionar aos Favoritos/i });
    fireEvent.click(button);
    expect(repoProps.toggleFavorite).toHaveBeenCalled();
  });
});
