import {
  VStack,
  Text,
  Spinner,
  List,
  ListItem,
  Checkbox,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import type { Todo } from '../types/todo';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onToggleTodo: (id: number) => Promise<void>;
  onDeleteTodo: (id: number) => Promise<void>;
}

export const TodoList = ({
  todos,
  isLoading,
  onToggleTodo,
  onDeleteTodo,
}: TodoListProps) => {
  if (isLoading) {
    return (
      <VStack w="100%" pt={4}>
        <Spinner size="xl" />
        <Text>Loading todos...</Text>
      </VStack>
    );
  }

  if (todos.length === 0) {
    return (
      <Text color="gray.500" textAlign="center">
        No todos yet. Add some tasks above!
      </Text>
    );
  }

  return (
    <List spacing={3} w="100%">
      {todos.map((todo) => (
        <ListItem
          key={todo.id}
          p={4}
          bg="white"
          borderRadius="md"
          boxShadow="sm"
          _hover={{ boxShadow: 'md' }}
        >
          <HStack justify="space-between">
            <Checkbox
              isChecked={todo.completed}
              onChange={() => onToggleTodo(todo.id)}
              size="lg"
            >
              <Text
                textDecoration={todo.completed ? 'line-through' : 'none'}
                color={todo.completed ? 'gray.500' : 'black'}
              >
                {todo.title}
              </Text>
            </Checkbox>
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => onDeleteTodo(todo.id)}
              aria-label="Delete todo"
              colorScheme="red"
              variant="ghost"
              size="sm"
            />
          </HStack>
        </ListItem>
      ))}
    </List>
  );
};