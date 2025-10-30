import React, { useState } from 'react';
import { Box, Heading, VStack, Input, HStack, Select, Button } from '@chakra-ui/react';

interface AddTaskData {
  title: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface AddTaskFormProps {
  onAdd: (data: AddTaskData) => void | Promise<void>;
  onCancel: () => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const submit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), dueDate: date || undefined, priority });
    setTitle('');
    setDate('');
    setPriority('medium');
  };

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="md" mb={6} borderWidth={2} borderColor="green.500">
      <Heading as="h3" size="md" mb={4}>
        New Task
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
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            size="lg"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
        </HStack>
        <HStack>
          <Button colorScheme="green" onClick={submit}>
            Add
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
