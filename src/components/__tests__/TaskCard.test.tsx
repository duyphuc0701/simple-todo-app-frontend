import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { describe, expect, it, vi } from 'vitest';

import TaskCard from '../TaskCard';
import type { Todo } from '../../types/todo';

describe('TaskCard', () => {
  it('renders todo and responds to toggle, edit and delete', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    const mockEdit = vi.fn();
    const mockSaveEdit = vi.fn();
    const mockDelete = vi.fn();

    const todo: Todo = {
      id: 123,
      title: 'Sample Task',
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: '2025-12-01',
      priority: 'medium',
    };

    render(
      <ChakraProvider>
        <TaskCard
          todo={todo}
          editingId={null}
          editTitle={''}
          setEditTitle={() => {}}
          onToggle={mockToggle}
          onEdit={mockEdit}
          onSaveEdit={mockSaveEdit}
          onDelete={mockDelete}
          showDelete={true}
          formatDate={(s) => s}
          getPriorityColor={() => 'gray.300'}
        />
      </ChakraProvider>
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(mockToggle).toHaveBeenCalledWith(123);

    const editBtn = screen.getByRole('button', { name: /edit task/i });
    await user.click(editBtn);
    expect(mockEdit).toHaveBeenCalledWith(123, 'Sample Task');

    const deleteBtn = screen.getByRole('button', { name: /delete task/i });
    await user.click(deleteBtn);
    expect(mockDelete).toHaveBeenCalledWith(123);
  });
});
