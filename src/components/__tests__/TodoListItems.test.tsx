import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { describe, expect, it, vi } from 'vitest';

import { TodoList } from '../TodoList';
import type { Todo } from '../../types/todo';

describe('TodoList items', () => {
  it('renders todos and allows delete and toggle', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    const mockDelete = vi.fn();

    const todos: Todo[] = [
      { id: 10, title: 'Item 1', completed: false, createdAt: new Date().toISOString() },
    ];

    render(
      <ChakraProvider>
        <TodoList todos={todos} isLoading={false} onToggleTodo={mockToggle} onDeleteTodo={mockDelete} />
      </ChakraProvider>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(mockToggle).toHaveBeenCalledWith(10);

    const del = screen.getByRole('button', { name: /delete todo/i });
    await user.click(del);
    expect(mockDelete).toHaveBeenCalledWith(10);
  });
});
