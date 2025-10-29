import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { describe, expect, it } from 'vitest';

import { TodoList } from '../TodoList';

describe('TodoList', () => {
  it('shows a loading state when isLoading is true', () => {
    render(
      <ChakraProvider>
        <TodoList todos={[]} isLoading={true} onToggleTodo={async () => {}} onDeleteTodo={async () => {}} />
      </ChakraProvider>
    );

    expect(screen.getByText(/loading todos/i)).toBeInTheDocument();
  });

  it('shows an empty state when no todos', () => {
    render(
      <ChakraProvider>
        <TodoList todos={[]} isLoading={false} onToggleTodo={async () => {}} onDeleteTodo={async () => {}} />
      </ChakraProvider>
    );

    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });
});
