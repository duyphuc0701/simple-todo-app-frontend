import { useState, useEffect } from 'react';
import { Box, Container, Heading, Flex, Button, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import type { Todo } from './types/todo';

import NameEntry from './components/NameEntry';
import HeroHeader from './components/HeroHeader';
import TabNavigation from './components/TabNavigation';
import AddTaskForm from './components/AddTaskForm';
import TaskListView from './components/TaskListView';

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
  const [editTitle, setEditTitle] = useState('');

  const toast = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('todoUserName');
    if (saved) setUserName(saved);
  }, []);

  useEffect(() => {
    if (userName) {
      const mockTodos: Todo[] = [
        { id: 1, title: 'Test', completed: true, createdAt: '2025-09-18T10:00:00Z', dueDate: '2025-09-18', priority: 'low' },
        { id: 2, title: 'ASsaSASsa', completed: true, createdAt: '2025-09-09T10:00:00Z', dueDate: '2025-09-09', priority: 'low' },
        { id: 3, title: 'Task 1', completed: true, createdAt: '2025-10-10T10:00:00Z', dueDate: '2025-10-10', priority: 'high' },
        { id: 4, title: 'Buy groceries', completed: false, createdAt: '2025-10-29T10:00:00Z', dueDate: '2025-10-29', priority: 'medium' },
        { id: 5, title: 'Call dentist', completed: false, createdAt: '2025-10-30T10:00:00Z', dueDate: '2025-10-30', priority: 'low' },
        { id: 6, title: 'Submit report', completed: false, createdAt: '2025-10-20T10:00:00Z', dueDate: '2025-10-20', priority: 'high' },
      ];
      setTodos(mockTodos);
    }
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
    localStorage.setItem('todoUserName', name);
    setUserName(name);
    toast({ title: `Welcome, ${name}!`, status: 'success', duration: 2000 });
  };

  const handleChangeUser = () => {
    localStorage.removeItem('todoUserName');
    setUserName(null);
  };

  const handleAddTask = (data: { title: string; dueDate?: string; priority?: 'low'|'medium'|'high' }) => {
    if (!data.title.trim()) {
      toast({ title: 'Please enter a task', status: 'warning', duration: 2000 });
      return;
    }
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
    toast({ title: 'Task added successfully', status: 'success', duration: 2000 });
  };

  const handleToggle = (id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    toast({ title: 'Task deleted successfully', status: 'success', duration: 2000 });
  };

  const handleEdit = (id: number, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleSaveEdit = (id: number) => {
    if (!editTitle.trim()) return;
    setTodos(prev => prev.map(t => t.id === id ? { ...t, title: editTitle } : t));
    setEditingId(null);
    setEditTitle('');
    toast({ title: 'Task updated successfully', status: 'success', duration: 2000 });
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

  if (!userName) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <NameEntry onSaveName={handleSaveName} />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <HeroHeader userName={userName} onChangeUser={handleChangeUser} />

      <Container maxW="container.lg" px={4} mt={-6}>
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </Container>

      <Container maxW="container.lg" px={4} py={8}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading as="h2" size="xl" color="gray.900">
            Tasks
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="green"
            size="lg"
            onClick={() => setIsAddingTask(true)}
            shadow="md"
          >
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
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onSaveEdit={handleSaveEdit}
          onDelete={handleDelete}
          formatDate={formatDate}
          getPriorityColor={getPriorityColor}
        />
      </Container>
    </Box>
  );
}

export default App;