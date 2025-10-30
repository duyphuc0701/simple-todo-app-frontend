import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  Select,
  Checkbox,
  IconButton,
  useToast,
  Collapse,
  Flex,
} from '@chakra-ui/react';
import { 
  AddIcon, 
  EditIcon, 
  DeleteIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  TimeIcon 
} from '@chakra-ui/icons';

type TabType = 'today' | 'pending' | 'overdue';

interface ExtendedTodo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

function App() {
  // User management
  const [userName, setUserName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  
  // Todo management
  const [todos, setTodos] = useState<ExtendedTodo[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const toast = useToast();

  // Load user name from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('todoUserName');
    if (saved) {
      setUserName(saved);
    }
  }, []);

  // Load mock data
  useEffect(() => {
    if (userName) {
      const mockTodos: ExtendedTodo[] = [
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

  const filterTodos = (todos: ExtendedTodo[], type: TabType) => {
    return todos.filter(todo => {
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

  const handleSaveName = () => {
    if (!nameInput.trim()) {
      toast({
        title: 'Please enter your name',
        status: 'warning',
        duration: 2000,
      });
      return;
    }
    localStorage.setItem('todoUserName', nameInput);
    setUserName(nameInput);
    toast({
      title: `Welcome, ${nameInput}!`,
      status: 'success',
      duration: 2000,
    });
  };

  const handleChangeUser = () => {
    localStorage.removeItem('todoUserName');
    setUserName(null);
    setNameInput('');
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: 'Please enter a task',
        status: 'warning',
        duration: 2000,
      });
      return;
    }
    
    const newTodo: ExtendedTodo = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: newTaskDate || undefined,
      priority: newTaskPriority
    };
    
    setTodos([...todos, newTodo]);
    setNewTaskTitle('');
    setNewTaskDate('');
    setIsAddingTask(false);
    
    toast({
      title: 'Task added successfully',
      status: 'success',
      duration: 2000,
    });
  };

  const handleToggle = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
    toast({
      title: 'Task deleted successfully',
      status: 'success',
      duration: 2000,
    });
  };

  const handleEdit = (id: number, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleSaveEdit = (id: number) => {
    if (!editTitle.trim()) return;
    setTodos(todos.map(t => t.id === id ? { ...t, title: editTitle } : t));
    setEditingId(null);
    setEditTitle('');
    toast({
      title: 'Task updated successfully',
      status: 'success',
      duration: 2000,
    });
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

  // If user hasn't entered name yet, show the NameEntry modal only
  if (!userName) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Box bg="white" p={8} borderRadius="lg" shadow="xl" maxW="md" w="full">
          <Heading as="h2" size="xl" mb={2} textAlign="center" color="green.700">
            Welcome to Todo App
          </Heading>
          <Text mb={6} textAlign="center" color="gray.600">
            Please enter your name to get started:
          </Text>
          <VStack spacing={4}>
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name..."
              size="lg"
              onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
              autoFocus
            />
            <Button 
              colorScheme="green" 
              w="full" 
              size="lg"
              onClick={handleSaveName}
            >
              Start
            </Button>
          </VStack>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">

      {/* Hero Header */}
      <Box
        bgGradient="linear(to-r, green.900, green.800, green.900)"
        color="white"
        py={12}
        px={4}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          inset={0}
          opacity={0.2}
          bgGradient="radial(circle at 30% 50%, whiteAlpha.100, transparent)"
        />
        <Container maxW="container.lg" position="relative" zIndex={1}>
          <Heading as="h1" size="3xl" textAlign="center">
            Todo App
          </Heading>
          {userName && (
            <VStack mt={4} spacing={1}>
              <Text fontSize="lg">Hello, {userName}! 👋</Text>
              <Button
                size="sm"
                variant="link"
                color="whiteAlpha.800"
                onClick={handleChangeUser}
                _hover={{ color: 'white' }}
              >
                Change user
              </Button>
            </VStack>
          )}
        </Container>
      </Box>

      {/* Tab Navigation */}
      <Container maxW="container.lg" px={4} mt={-6}>
        <HStack spacing={0} bg="white" borderRadius="lg" shadow="md" overflow="hidden">
          <Button
            flex={1}
            py={6}
            onClick={() => setActiveTab('today')}
            bg={activeTab === 'today' ? 'green.700' : 'green.100'}
            color={activeTab === 'today' ? 'white' : 'green.800'}
            _hover={{ bg: activeTab === 'today' ? 'green.700' : 'green.200' }}
            borderRadius={0}
            fontWeight="semibold"
          >
            Today
          </Button>
          <Button
            flex={1}
            py={6}
            onClick={() => setActiveTab('pending')}
            bg={activeTab === 'pending' ? 'green.700' : 'green.100'}
            color={activeTab === 'pending' ? 'white' : 'green.800'}
            _hover={{ bg: activeTab === 'pending' ? 'green.700' : 'green.200' }}
            borderRadius={0}
            fontWeight="semibold"
          >
            Pending
          </Button>
          <Button
            flex={1}
            py={6}
            onClick={() => setActiveTab('overdue')}
            bg={activeTab === 'overdue' ? 'green.700' : 'green.100'}
            color={activeTab === 'overdue' ? 'white' : 'green.800'}
            _hover={{ bg: activeTab === 'overdue' ? 'green.700' : 'green.200' }}
            borderRadius={0}
            fontWeight="semibold"
          >
            Overdue
          </Button>
        </HStack>
      </Container>

      {/* Main Content */}
      <Container maxW="container.lg" px={4} py={8}>
        {/* Tasks Header */}
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

        {/* Add Task Form */}
        {isAddingTask && (
          <Box bg="white" p={6} borderRadius="lg" shadow="md" mb={6} borderWidth={2} borderColor="green.500">
            <Heading as="h3" size="md" mb={4}>
              New Task
            </Heading>
            <VStack spacing={3} align="stretch">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title..."
                size="lg"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <HStack>
                <Input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  size="lg"
                />
                <Select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  size="lg"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </Select>
              </HStack>
              <HStack>
                <Button colorScheme="green" onClick={handleAddTask}>
                  Add
                </Button>
                <Button
                  variant="solid"
                  bg="gray.300"
                  _hover={{ bg: 'gray.400' }}
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskTitle('');
                    setNewTaskDate('');
                  }}
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}

        {/* Active Tasks */}
        <Box bg="white" borderRadius="lg" shadow="md" p={6} mb={6}>
          {activeTodos.length === 0 ? (
            <Box textAlign="center" py={12}>
              <Text fontSize="lg" color="gray.500">
                No data to display
              </Text>
            </Box>
          ) : (
            <VStack spacing={3} align="stretch">
              {activeTodos.map(todo => (
                <Box
                  key={todo.id}
                  p={4}
                  borderWidth={1}
                  borderColor="gray.200"
                  borderRadius="lg"
                  _hover={{ shadow: 'md' }}
                  transition="all 0.2s"
                >
                  <HStack spacing={4}>
                    <Checkbox
                      isChecked={todo.completed}
                      onChange={() => handleToggle(todo.id)}
                      size="lg"
                      colorScheme="green"
                    />
                    
                    {editingId === todo.id ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleSaveEdit(todo.id)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(todo.id)}
                        size="md"
                        autoFocus
                      />
                    ) : (
                      <Text flex={1} color="gray.900">
                        {todo.title}
                      </Text>
                    )}
                    
                    {todo.dueDate && (
                      <HStack color="gray.500" fontSize="sm">
                        <TimeIcon />
                        <Text>{formatDate(todo.dueDate)}</Text>
                      </HStack>
                    )}
                    
                    <IconButton
                      icon={<EditIcon />}
                      onClick={() => handleEdit(todo.id, todo.title)}
                      aria-label="Edit task"
                      variant="ghost"
                      colorScheme="gray"
                      size="sm"
                    />
                    
                    <Box
                      w={3}
                      h={8}
                      borderRadius="md"
                      bg={getPriorityColor(todo.priority)}
                    />
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Box>

        {/* Completed Section */}
        {completedTodos.length > 0 && (
          <Box bg="white" borderRadius="lg" shadow="md" overflow="hidden">
            <Button
              w="full"
              justifyContent="space-between"
              variant="ghost"
              p={4}
              onClick={() => setShowCompleted(!showCompleted)}
              _hover={{ bg: 'gray.50' }}
              borderRadius={0}
            >
              <Heading as="h3" size="lg" color="gray.900">
                Completed
              </Heading>
              {showCompleted ? <ChevronUpIcon boxSize={6} /> : <ChevronDownIcon boxSize={6} />}
            </Button>
            
            <Collapse in={showCompleted} animateOpacity>
              <Box p={6}>
                <VStack spacing={3} align="stretch">
                  {completedTodos.map(todo => (
                    <Box
                      key={todo.id}
                      p={4}
                      borderWidth={1}
                      borderColor="gray.200"
                      borderRadius="lg"
                      _hover={{ shadow: 'md' }}
                      transition="all 0.2s"
                    >
                      <HStack spacing={4}>
                        <Checkbox
                          isChecked={todo.completed}
                          onChange={() => handleToggle(todo.id)}
                          size="lg"
                          colorScheme="green"
                        />
                        
                        <Text
                          flex={1}
                          color="gray.400"
                          textDecoration="line-through"
                        >
                          {todo.title}
                        </Text>
                        
                        {todo.dueDate && (
                          <HStack color="gray.400" fontSize="sm">
                            <TimeIcon />
                            <Text>{formatDate(todo.dueDate)}</Text>
                          </HStack>
                        )}
                        
                        <IconButton
                          icon={<EditIcon />}
                          onClick={() => handleEdit(todo.id, todo.title)}
                          aria-label="Edit task"
                          variant="ghost"
                          colorScheme="gray"
                          size="sm"
                          color="gray.300"
                        />
                        
                        <IconButton
                          icon={<DeleteIcon />}
                          onClick={() => handleDelete(todo.id)}
                          aria-label="Delete task"
                          variant="ghost"
                          colorScheme="red"
                          size="sm"
                          color="gray.300"
                          _hover={{ color: 'red.500' }}
                        />
                        
                        <Box
                          w={3}
                          h={8}
                          borderRadius="md"
                          bg={getPriorityColor(todo.priority)}
                        />
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </Collapse>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;