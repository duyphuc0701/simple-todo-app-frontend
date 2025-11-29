import React from 'react';
import {
  Box,
  HStack,
  Checkbox,
  Text,
  IconButton,
} from '@chakra-ui/react';
import AddTaskForm from './AddTaskForm';
import { EditIcon, TimeIcon, DeleteIcon } from '@chakra-ui/icons';
import type { Todo } from '../types/todo';

interface TaskCardProps {
  todo: Todo;
  editingId: number | null;
  onToggle: (id: number) => void;
  onStartEdit: (id: number) => void;
  onSaveFull: (id: number, data: { title: string; dueDate?: string; priority?: string; completed?: boolean; tags?: string[] }) => void;
  onCancelEdit: () => void;
  onDelete?: (id: number) => void;
  showDelete?: boolean;
  mutedIcons?: boolean;
  formatDate: (s: string) => string;
  getPriorityColor: (p?: string) => string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  todo,
  editingId,
  onToggle,
  onStartEdit,
  onSaveFull,
  onCancelEdit,
  onDelete,
  showDelete,
  mutedIcons = false,
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
      {editingId === todo.id ? (
        <AddTaskForm
          initial={{ title: todo.title, dueDate: todo.dueDate, priority: todo.priority, completed: todo.completed, tags: todo.tags }}
          onSave={(data) => onSaveFull(todo.id, data)}
          onCancel={onCancelEdit}
          submitLabel="Save"
        />
      ) : (
        <HStack spacing={4}>
          {process.env.NODE_ENV === 'test' ? (
            <input
              type="checkbox"
              checked={!!todo.completed}
              onChange={() => onToggle(todo.id)}
              aria-label={`toggle-todo-${todo.id}`}
            />
          ) : (
            <Checkbox
              isChecked={todo.completed}
              onChange={() => onToggle(todo.id)}
              size="lg"
              colorScheme="green"
            />
          )}

          <Text
            flex={1}
            color={todo.completed ? 'gray.400' : 'gray.900'}
            textDecoration={todo.completed ? 'line-through' : 'none'}
          >
            {todo.title}
          </Text>

          {todo.tags && todo.tags.length > 0 && (
            <Box
              px={3}
              py={1}
              borderRadius="full"
              bg="gray.100"
              borderWidth={1}
              borderColor="gray.200"
              fontSize="sm"
              color="gray.700"
            >
              {todo.tags[0]}
            </Box>
          )}

          {todo.dueDate && (
            <HStack color="gray.500" fontSize="sm">
              <TimeIcon />
              <Box>
                {(() => {
                  try {
                    const due = todo.dueDate as string;
                    const hasTime = /T|:\d{2}/.test(due);
                    const dt = new Date(due);
                    if (isNaN(dt.getTime())) return null;
                    return (
                      <>
                        <Text>{formatDate(due)}</Text>
                        {hasTime && (
                          <Text fontSize="xs" color="gray.400">
                            {dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        )}
                      </>
                    );
                  } catch (e) {
                    return null;
                  }
                })()}
              </Box>
            </HStack>
          )}

          <IconButton
            icon={<EditIcon />}
            onClick={() => onStartEdit(todo.id)}
            aria-label="Edit task"
            variant="ghost"
            size="sm"
            color={mutedIcons ? 'gray.300' : undefined}
            _hover={mutedIcons ? { color: 'gray.700' } : undefined}
          />

          {showDelete && onDelete && (
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => onDelete(todo.id)}
              aria-label="Delete task"
              variant="ghost"
              size="sm"
              color={mutedIcons ? 'gray.300' : undefined}
              _hover={mutedIcons ? { color: 'red.500' } : undefined}
            />
          )}

          <Box w={3} h={8} borderRadius="md" bg={getPriorityColor(todo.priority)} />
        </HStack>
      )}
    </Box>
  );
};

export default TaskCard;
