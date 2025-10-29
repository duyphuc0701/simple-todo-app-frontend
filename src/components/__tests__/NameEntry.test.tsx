import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { describe, expect, it, vi } from 'vitest';

import { NameEntry } from '../NameEntry';

describe('NameEntry', () => {
  it('calls onSaveName with the entered name', async () => {
    const user = userEvent.setup();
    const mockSave = vi.fn().mockResolvedValue(undefined);

    render(
      <ChakraProvider>
        <NameEntry onSaveName={mockSave} />
      </ChakraProvider>
    );

    const input = screen.getByPlaceholderText('Your name');
    const button = screen.getByRole('button', { name: /continue/i });

    await user.type(input, '  Alice  ');
    await user.click(button);

    expect(mockSave).toHaveBeenCalledWith('Alice');
  });
});
