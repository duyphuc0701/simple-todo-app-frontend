import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { describe, expect, it, vi } from 'vitest';

import TaskListView from '../TaskListView';
import type { Todo } from '../../types/todo';

describe('TaskListView', () => {
  it('renders active and completed todos and toggles completed collapse', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    const mockEdit = vi.fn();
    const mockSave = vi.fn();
    const mockDelete = vi.fn();
    const mockSetShow = vi.fn();

    const active: Todo[] = [
      { id: 1, title: 'A', completed: false, createdAt: new Date().toISOString() },
    ];
    const completed: Todo[] = [
      { id: 2, title: 'B', completed: true, createdAt: new Date().toISOString() },
    ];

    render(
      <ChakraProvider>
        <TaskListView
          activeTodos={active}
          completedTodos={completed}
          showCompleted={true}
          setShowCompleted={mockSetShow}
          editingId={null}
          editTitle={''}
          setEditTitle={() => {}}
          onToggle={mockToggle}
          onEdit={mockEdit}
          onSaveEdit={mockSave}
          onDelete={mockDelete}
          formatDate={(s) => s}
          getPriorityColor={() => 'gray.300'}
        />
      </ChakraProvider>
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    // Completed header should be present
    expect(screen.getByRole('heading', { name: /completed/i })).toBeInTheDocument();
    // Completed item visible
    expect(screen.getByText('B')).toBeInTheDocument();

    const collapseBtn = screen.getByRole('button', { name: /completed/i });
    await user.click(collapseBtn);
    expect(mockSetShow).toHaveBeenCalled();
  });
});
