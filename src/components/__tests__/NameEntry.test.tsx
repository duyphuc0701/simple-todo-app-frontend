import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { describe, expect, it, vi } from 'vitest';

import { NameEntry } from '../NameEntry';

describe('NameEntry', () => {
  it('calls onSaveName with the entered name (trimmed)', async () => {
    const user = userEvent.setup();
    const mockSave = vi.fn().mockResolvedValue(undefined);

    render(
      <ChakraProvider>
        <NameEntry onSaveName={mockSave} />
      </ChakraProvider>
    );

    // Use role queries to be resilient to small placeholder/text changes
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /start|continue|submit/i });

    await user.type(input, '  Alice  ');
    await user.click(button);

    expect(mockSave).toHaveBeenCalledWith('Alice');
  });
});
