import React, { useState, useEffect, useMemo } from 'react';
import { Box, Heading, VStack, Input, HStack, Select, Button } from '@chakra-ui/react';

interface AddTaskData {
  title: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
  tags?: string[];
}

interface AddTaskFormProps {
  onAdd?: (data: AddTaskData) => void | Promise<void>;
  onSave?: (data: AddTaskData) => void | Promise<void>;
  onCancel: () => void;
  initial?: AddTaskData;
  submitLabel?: string;
}

// Utility to parse incoming data into form-friendly Local Time values
const parseInitialData = (data?: AddTaskData) => {
  let dateVal = '';
  let timeVal = '';

  if (data?.dueDate) {
    try {
      const localDate = new Date(data.dueDate);
      if (!isNaN(localDate.getTime())) {
        // Convert to YYYY-MM-DD for Date Input (Local Time)
        const year = localDate.getFullYear();
        const month =String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        dateVal = `${year}-${month}-${day}`;

        // Convert to HH:mm for Time Input (Local Time)
        // Only set time if the ISO string actually had time components (simple check)
        if (data.dueDate.includes('T')) {
            const hours = String(localDate.getHours()).padStart(2, '0');
            const minutes = String(localDate.getMinutes()).padStart(2, '0');
            timeVal = `${hours}:${minutes}`;
        }
      }
    } catch (e) {
      console.error("Failed to parse date", e);
    }
  }

  return {
    title: data?.title ?? '',
    date: dateVal,
    time: timeVal,
    priority: data?.priority ?? 'medium',
    completed: !!data?.completed,
    tag: (data?.tags && data.tags.length > 0) ? data.tags[0] : 'Work'
  };
};

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd, onSave, onCancel, initial, submitLabel }) => {
  // 1. Use useMemo to derive initial values so logic isn't repeated
  const defaultValues = useMemo(() => parseInitialData(initial), [initial]);

  // 2. Initialize state with the parsed values
  const [title, setTitle] = useState(defaultValues.title);
  const [date, setDate] = useState(defaultValues.date);
  const [time, setTime] = useState(defaultValues.time);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(defaultValues.priority);
  const [completed, setCompleted] = useState<boolean>(defaultValues.completed);
  const [tag, setTag] = useState<'Work' | 'Entertainment' | 'Health'>(defaultValues.tag as any);

  // 3. Sync state when `initial` prop changes (e.g. switching between tasks)
  useEffect(() => {
    const newData = parseInitialData(initial);
    setTitle(newData.title);
    setDate(newData.date);
    setTime(newData.time);
    setPriority(newData.priority);
    setCompleted(newData.completed);
    setTag(newData.tag as any);
  }, [initial]);

  const submit = () => {
    if (!title.trim()) return;
    let due: string | undefined = undefined;
    
    if (date) {
        // Combine Date and Time into a proper Date object
        const dateString = time ? `${date}T${time}` : date;
        const dt = new Date(dateString); 
        // toISOString() will convert the Local Input time back to UTC for storage
        due = !isNaN(dt.getTime()) ? dt.toISOString() : date; 
    }

    const payload: AddTaskData = { title: title.trim(), dueDate: due, priority, completed };
    if (tag) payload.tags = [tag];

    if (onSave) {
      onSave(payload);
    } else if (onAdd) {
      onAdd(payload);
      // Reset form to defaults
      setTitle('');
      setDate('');
      setTime('');
      setPriority('medium');
      setCompleted(false);
      setTag('Work');
    }
  };

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="md" mb={6} borderWidth={2} borderColor="green.500">
      <Heading as="h3" size="md" mb={4}>
        {initial ? 'Edit Task' : 'New Task'}
      </Heading>
      <VStack spacing={3} align="stretch">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
          size="lg"
          autoFocus
          onKeyPress={(e) => e.key === 'Enter' && submit()}
        />
        <HStack>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            size="lg"
          />
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            size="lg"
          />
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            size="lg"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
          <Select value={tag} onChange={(e) => setTag(e.target.value as any)} size="lg">
            <option value="Work">Work</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
          </Select>
        </HStack>
        <HStack>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} />
            <span style={{ color: 'gray' }}>Completed</span>
          </label>
        </HStack>
        <HStack>
          <Button colorScheme="green" onClick={submit}>
            {submitLabel ?? (onSave ? 'Save' : 'Add')}
          </Button>
          <Button
            variant="solid"
            bg="gray.300"
            _hover={{ bg: 'gray.400' }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default AddTaskForm;