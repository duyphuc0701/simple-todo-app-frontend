import React from 'react';
import {
  Box,
  HStack,
  Checkbox,
  Text,
  IconButton,
  Input,
} from '@chakra-ui/react';
import { EditIcon, TimeIcon, DeleteIcon } from '@chakra-ui/icons';
import type { Todo } from '../types/todo';

interface TaskCardProps {
  todo: Todo;
  editingId: number | null;
  editTitle: string;
  setEditTitle: (s: string) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number, title: string) => void;
  onSaveEdit: (id: number) => void;
  onDelete?: (id: number) => void;
  showDelete?: boolean;
  formatDate: (s: string) => string;
  getPriorityColor: (p?: string) => string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  todo,
  editingId,
  editTitle,
  setEditTitle,
  onToggle,
  onEdit,
  onSaveEdit,
  onDelete,
  showDelete,
  formatDate,
  getPriorityColor,
}) => {
  return (
    <Box
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
          onChange={() => onToggle(todo.id)}
          size="lg"
          colorScheme="green"
        />

        {editingId === todo.id ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={() => onSaveEdit(todo.id)}
            onKeyPress={(e) => e.key === 'Enter' && onSaveEdit(todo.id)}
            size="md"
            autoFocus
          />
        ) : (
          <Text
            flex={1}
            color={todo.completed ? 'gray.400' : 'gray.900'}
            textDecoration={todo.completed ? 'line-through' : 'none'}
          >
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
          onClick={() => onEdit(todo.id, todo.title)}
          aria-label="Edit task"
          variant="ghost"
          colorScheme="gray"
          size="sm"
        />

        {showDelete && onDelete && (
          <IconButton
            icon={<DeleteIcon />}
            onClick={() => onDelete(todo.id)}
            aria-label="Delete task"
            variant="ghost"
            colorScheme="red"
            size="sm"
          />
        )}

        <Box w={3} h={8} borderRadius="md" bg={getPriorityColor(todo.priority)} />
      </HStack>
    </Box>
  );
};

export default TaskCard;
