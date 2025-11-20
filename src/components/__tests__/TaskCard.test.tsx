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
    const mockStartEdit = vi.fn();
    const mockSaveEdit = vi.fn();
    const mockCancelEdit = vi.fn();
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
          onToggle={mockToggle}
          onStartEdit={mockStartEdit}
          onSaveFull={mockSaveEdit}
          onCancelEdit={mockCancelEdit}
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
    expect(mockStartEdit).toHaveBeenCalledWith(123);

    const deleteBtn = screen.getByRole('button', { name: /delete task/i });
    await user.click(deleteBtn);
    expect(mockDelete).toHaveBeenCalledWith(123);
  });

  it('shows time when dueDate includes a time component', async () => {
    const mockToggle = vi.fn();
    const mockStartEdit = vi.fn();
    const mockSaveEdit = vi.fn();
    const mockCancelEdit2 = vi.fn();
    const mockDelete = vi.fn();

    const todoWithTime: Todo = {
      id: 456,
      title: 'Timed Task',
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: '2025-12-01T14:30:00Z',
      priority: 'low',
    };

    render(
      <ChakraProvider>
        <TaskCard
          todo={todoWithTime}
          editingId={null}
          onToggle={mockToggle}
          onStartEdit={mockStartEdit}
          onSaveFull={mockSaveEdit}
          onCancelEdit={mockCancelEdit2}
          onDelete={mockDelete}
          showDelete={true}
          formatDate={(s) => s}
          getPriorityColor={() => 'gray.300'}
        />
      </ChakraProvider>
    );

    // Expect at least one time-like string (HH:MM) to appear
    const timeMatches = screen.getAllByText(/\d{1,2}:\d{2}/);
    expect(timeMatches.length).toBeGreaterThanOrEqual(1);
  });
});
