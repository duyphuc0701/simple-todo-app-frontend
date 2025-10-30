import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { describe, expect, it, vi } from 'vitest';

import TabNavigation from '../TabNavigation';

describe('TabNavigation', () => {
  it('renders tabs and calls setActiveTab on click', async () => {
    const user = userEvent.setup();
    const mockSet = vi.fn();

    render(
      <ChakraProvider>
        <TabNavigation activeTab="today" setActiveTab={mockSet} />
      </ChakraProvider>
    );

    const pending = screen.getByRole('button', { name: /pending/i });
    await user.click(pending);
    expect(mockSet).toHaveBeenCalledWith('pending');

    const overdue = screen.getByRole('button', { name: /overdue/i });
    await user.click(overdue);
    expect(mockSet).toHaveBeenCalledWith('overdue');
  });
});
