import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { describe, expect, it, vi } from 'vitest';

import AddTaskForm from '../AddTaskForm';

describe('AddTaskForm', () => {
  it('sends ISO datetime when date and time are provided', async () => {
    const user = userEvent.setup();
    const mockAdd = vi.fn().mockResolvedValue(undefined);
    const mockCancel = vi.fn();

    render(
      <ChakraProvider>
        <AddTaskForm onAdd={mockAdd} onCancel={mockCancel} />
      </ChakraProvider>
    );

    const titleInput = screen.getByPlaceholderText(/task title/i);
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement | null;
    const timeInput = document.querySelector('input[type="time"]') as HTMLInputElement | null;
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(titleInput, 'Event with time');
    if (dateInput) await user.type(dateInput, '2025-12-01');
    if (timeInput) await user.type(timeInput, '14:30');

    await user.click(addButton);

    expect(mockAdd).toHaveBeenCalled();
    const calledWith = mockAdd.mock.calls[0][0];
    // dueDate should be an ISO datetime string that parses to a number
    expect(calledWith.dueDate).toBeDefined();
    expect(Number.isNaN(Date.parse(calledWith.dueDate))).toBe(false);
    expect(calledWith.title).toBe('Event with time');
  });
});
