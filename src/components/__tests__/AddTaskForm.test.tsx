import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { describe, expect, it, vi } from 'vitest';

import AddTaskForm from '../AddTaskForm';

describe('AddTaskForm', () => {
  it('calls onAdd with title, date and priority and clears inputs via parent', async () => {
    const user = userEvent.setup();
    const mockAdd = vi.fn().mockResolvedValue(undefined);
    const mockCancel = vi.fn();

    render(
      <ChakraProvider>
        <AddTaskForm onAdd={mockAdd} onCancel={mockCancel} />
      </ChakraProvider>
    );

  const titleInput = screen.getByPlaceholderText(/task title/i);
  // find date input by type selector
  const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement | null;
    const addButton = screen.getByRole('button', { name: /add/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    await user.type(titleInput, '  New Task  ');
  // set date via typing iso date (if present)
  if (dateInput) await user.type(dateInput, '2025-12-01');
    // choose priority select
    const priority = screen.getByRole('combobox') as HTMLSelectElement;
    await user.selectOptions(priority, 'high');

    await user.click(addButton);

    expect(mockAdd).toHaveBeenCalled();
    // expect called with trimmed title
    const calledWith = mockAdd.mock.calls[0][0];
    expect(calledWith.title).toBe('New Task');
    expect(calledWith.dueDate).toBe('2025-12-01');
    expect(calledWith.priority).toBe('high');

    // cancel should call onCancel
    await user.click(cancelButton);
    expect(mockCancel).toHaveBeenCalled();
  });
});
