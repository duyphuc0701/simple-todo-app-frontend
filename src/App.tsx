import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  useToast,
  Text,
} from '@chakra-ui/react';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { todoApi } from './api/todoApi';
import type { Todo } from './types/todo';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const fetchTodos = async () => {
    try {
      const data = await todoApi.getAllTodos();
      setTodos(data);
    } catch (error) {
      toast({
        title: 'Error fetching todos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (title: string) => {
    try {
      const newTodo = await todoApi.createTodo({ title });
      setTodos([...todos, newTodo]);
      toast({
        title: 'Todo added successfully',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error adding todo',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleToggleTodo = async (id: number) => {
    try {
      const updatedTodo = await todoApi.toggleTodo(id);
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (error) {
      toast({
        title: 'Error toggling todo',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoApi.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      toast({
        title: 'Todo deleted successfully',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error deleting todo',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            Todo App
          </Heading>
          <Text color="gray.500">
            Manage your tasks efficiently
          </Text>
        </Box>
        
        <TodoInput onAddTodo={handleAddTodo} />
        
        <TodoList
          todos={todos}
          isLoading={isLoading}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
        />
      </VStack>
    </Container>
  );
}

export default App;
