import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { describe, expect, it, vi } from 'vitest';

import { TodoInput } from '../TodoInput';

describe('TodoInput', () => {
  it('calls onAddTodo with the entered title and clears input', async () => {
    const user = userEvent.setup();
    const mockAdd = vi.fn().mockResolvedValue(undefined);

    render(
      <ChakraProvider>
        <TodoInput onAddTodo={mockAdd} />
      </ChakraProvider>
    );

    const input = screen.getByPlaceholderText('What needs to be done?');
    const button = screen.getByRole('button', { name: /add task/i });

    await user.type(input, 'Buy milk');
    await user.click(button);

    expect(mockAdd).toHaveBeenCalledWith('Buy milk');
    // After submit, input should be cleared
    expect((input as HTMLInputElement).value).toBe('');
  });
});
