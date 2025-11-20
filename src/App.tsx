import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container, Heading, Flex, Button, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import type { Todo } from './types/todo';

import NameEntry from './components/NameEntry';
import HeroHeader from './components/HeroHeader';
import TabNavigation from './components/TabNavigation';
import AddTaskForm from './components/AddTaskForm';
import TaskListView from './components/TaskListView';
import { todoApi } from './api/todoApi';

type TabType = 'today' | 'pending' | 'overdue';

function App() {
  const [userName, setUserName] = useState<string | null>(null);

  // todos
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);

  // editing
  const [editingId, setEditingId] = useState<number | null>(null);

  const toast = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('todoUserName');
    if (saved) setUserName(saved);
  }, []);

  // When a userName is present, fetch that user's todos from the backend using X-User-Name
  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      if (!userName) return;
      try {
        const data = await todoApi.getAllTodos();
        if (mounted) setTodos(data);
      } catch (e) {
        if (mounted) setTodos([]);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [userName]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filterTodos = (items: Todo[], type: TabType) => {
    return items.filter(todo => {
      if (todo.completed) return false;
      if (!todo.dueDate) return type === 'pending';
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      switch (type) {
        case 'today':
          return dueDate.getTime() === today.getTime();
        case 'pending':
          return dueDate.getTime() > today.getTime();
        case 'overdue':
          return dueDate.getTime() < today.getTime();
        default:
          return false;
      }
    });
  };

  const completedTodos = todos.filter(t => t.completed);
  const activeTodos = filterTodos(todos, activeTab);

  const handleSaveName = async (name: string) => {
    try {
      await todoApi.createUser({ name });
      const data = await todoApi.getAllTodos();
      setTodos(data || []);
      setUserName(name);
      toast({ title: `Welcome, ${name}!`, status: 'success', duration: 2000 });
    } catch (err) {
      toast({ title: 'Unable to create user or fetch todos', status: 'error', duration: 2500 });
    }
  };

  const handleChangeUser = () => {
    todoApi.setCurrentUserName(null);
    setUserName(null);
    setTodos([]);
  };

  const handleAddTask = (data: { title: string; dueDate?: string; priority?: 'low'|'medium'|'high' }) => {
    (async () => {
      if (!data.title.trim()) {
        toast({ title: 'Please enter a task', status: 'warning', duration: 2000 });
        return;
      }
      try {
        const created = await todoApi.createTodo({ title: data.title, dueDate: data.dueDate, priority: data.priority });
        setTodos(prev => [...prev, created]);
        setIsAddingTask(false);
        toast({ title: 'Task added successfully', status: 'success', duration: 2000 });
      } catch (err) {
        // fallback to local add
        const newTodo: Todo = {
          id: Date.now(),
          title: data.title,
          completed: false,
          createdAt: new Date().toISOString(),
          dueDate: data.dueDate,
          priority: data.priority,
        };
        setTodos(prev => [...prev, newTodo]);
        setIsAddingTask(false);
        toast({ title: 'Task added locally (offline)', status: 'warning', duration: 2500 });
      }
    })();
  };

  const handleToggle = (id: number) => {
    (async () => {
      try {
        const updated = await todoApi.toggleTodo(id);
        setTodos(prev => prev.map(t => t.id === id ? updated : t));
      } catch (err) {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
        toast({ title: 'Toggled locally (offline)', status: 'warning', duration: 2000 });
      }
    })();
  };

  const handleDelete = (id: number) => {
    (async () => {
      try {
        await todoApi.deleteTodo(id);
        setTodos(prev => prev.filter(t => t.id !== id));
        toast({ title: 'Task deleted successfully', status: 'success', duration: 2000 });
      } catch (err) {
        setTodos(prev => prev.filter(t => t.id !== id));
        toast({ title: 'Deleted locally (offline)', status: 'warning', duration: 2000 });
      }
    })();
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (id: number, data: { title: string; dueDate?: string; priority?: string; completed?: boolean }) => {
    (async () => {
      if (!data.title.trim()) return;
      try {
        const updated = await todoApi.updateTodo(id, { title: data.title, dueDate: data.dueDate, priority: data.priority as any, completed: data.completed });
        setTodos(prev => prev.map(t => t.id === id ? updated : t));
        setEditingId(null);
        toast({ title: 'Task updated successfully', status: 'success', duration: 2000 });
      } catch (err) {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, title: data.title, dueDate: data.dueDate, priority: data.priority as any, completed: data.completed ?? t.completed } : t));
        setEditingId(null);
        toast({ title: 'Updated locally (offline)', status: 'warning', duration: 2000 });
      }
    })();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'red.500';
      case 'medium': return 'yellow.400';
      case 'low': return 'yellow.300';
      default: return 'gray.300';
    }
  };

  return (
    <Routes>
      {/* LOGIN ROUTE */}
      <Route
        path="/login"
        element={
          userName ? (
            <Navigate to="/" replace />
          ) : (
            <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
              <NameEntry onSaveName={handleSaveName} />
            </Box>
          )
        }
      />

      {/* MAIN APP ROUTE */}
      <Route
        path="/"
        element={
          userName ? (
            <Box minH="100vh" bg="gray.50">
              <HeroHeader userName={userName} onChangeUser={handleChangeUser} />

              <Container maxW="container.lg" px={4} mt={-6}>
                <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
              </Container>

              <Container maxW="container.lg" px={4} py={8}>
                <Flex justify="space-between" align="center" mb={6}>
                  <Heading as="h2" size="xl" color="gray.900">Tasks</Heading>
                  <Button leftIcon={<AddIcon />} colorScheme="green" size="lg"
                    onClick={() => setIsAddingTask(true)} shadow="md">
                    Add Task
                  </Button>
                </Flex>

                {isAddingTask && (
                  <AddTaskForm onAdd={handleAddTask} onCancel={() => setIsAddingTask(false)} />
                )}

                <TaskListView
                  activeTodos={activeTodos}
                  completedTodos={completedTodos}
                  showCompleted={showCompleted}
                  setShowCompleted={setShowCompleted}
                  editingId={editingId}
                  onToggle={handleToggle}
                  onStartEdit={handleEdit}
                  onSaveFull={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  onDelete={handleDelete}
                  formatDate={formatDate}
                  getPriorityColor={getPriorityColor}
                />
              </Container>
            </Box>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* fallback to / */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;