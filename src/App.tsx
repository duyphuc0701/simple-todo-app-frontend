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
import { NameEntry } from './components/NameEntry';
import { todoApi } from './api/todoApi';
import type { Todo } from './types/todo';

function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('todoUserName');
    if (saved) setUserName(saved);
  }, []);

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
    // Only fetch todos if a user is present (future backend may scope by user)
    if (userName) fetchTodos();
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

  const handleSaveName = async (name: string) => {
    // Persist locally for now; backend integration can be added here.
    localStorage.setItem('todoUserName', name);
    setUserName(name);

    try {
      // Attempt to create user on backend if endpoint exists. Non-blocking.
      // Keep this call optional and swallow errors so UI remains usable when backend is absent.
      if (todoApi.createUser) {
        await todoApi.createUser({ name });
      }
    } catch (err) {
      // ignore: backend may not implement this yet
      console.debug('createUser API call failed (expected if backend not implemented)', err);
    }
  };

  const handleChangeUser = () => {
    localStorage.removeItem('todoUserName');
    setUserName(null);
    // Optionally clear todos or refetch when user changes
  };

  // If user hasn't entered name yet, show the NameEntry page
  if (!userName) {
    return (
      <Container maxW="container.sm" py={10}>
        <NameEntry onSaveName={handleSaveName} />
      </Container>
    );
  }

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            Todo App
          </Heading>
          <Text color="gray.500">Manage your tasks efficiently</Text>
          <Text mt={3} fontWeight="semibold">Hello, {userName}!</Text>
          <Text as="button" onClick={handleChangeUser} color="blue.500" mt={2}>
            Change user
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
