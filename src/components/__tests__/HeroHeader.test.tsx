import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { describe, expect, it, vi } from 'vitest';

import HeroHeader from '../HeroHeader';

describe('HeroHeader', () => {
  it('renders heading and greeting when userName present and calls onChangeUser', async () => {
    const user = userEvent.setup();
    const mockChange = vi.fn();

    render(
      <ChakraProvider>
        <HeroHeader userName="Bob" onChangeUser={mockChange} />
      </ChakraProvider>
    );

    expect(screen.getByRole('heading', { name: /todo app/i })).toBeInTheDocument();
    expect(screen.getByText(/hello, bob/i)).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /change user/i });
    await user.click(btn);
    expect(mockChange).toHaveBeenCalled();
  });

  it('does not show greeting when userName is not provided', () => {
    render(
      <ChakraProvider>
        <HeroHeader userName={null} onChangeUser={() => {}} />
      </ChakraProvider>
    );

    expect(screen.getByRole('heading', { name: /todo app/i })).toBeInTheDocument();
    // greeting should not be present
    expect(screen.queryByText(/hello,/i)).toBeNull();
  });
});
