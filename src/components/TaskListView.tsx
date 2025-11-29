import React from 'react';
import { Box, VStack, Text, Collapse, Button, Heading } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import type { Todo } from '../types/todo';
import TaskCard from './TaskCard';

interface TaskListViewProps {
  activeTodos: Todo[];
  completedTodos: Todo[];
  showCompleted: boolean;
  setShowCompleted: (v: boolean) => void;
  editingId: number | null;
  onToggle: (id: number) => void;
  onStartEdit: (id: number) => void;
  onSaveFull: (id: number, data: { title: string; dueDate?: string; priority?: string; completed?: boolean; tag?: 'Work'|'Entertainment'|'Health' }) => void;
  onCancelEdit: () => void;
  onDelete: (id: number) => void;
  formatDate: (s: string) => string;
  getPriorityColor: (p?: string) => string;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  activeTodos,
  completedTodos,
  showCompleted,
  setShowCompleted,
  editingId,
  onToggle,
  onStartEdit,
  onSaveFull,
  onCancelEdit,
  onDelete,
  formatDate,
  getPriorityColor,
}) => {
  return (
    <>
      <Box bg="white" borderRadius="lg" shadow="md" p={6} mb={6}>
        {activeTodos.length === 0 ? (
          <Box textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500">
              No data to display
            </Text>
          </Box>
        ) : (
          <VStack spacing={3} align="stretch">
                {activeTodos.map((todo) => (
                  <TaskCard
                    key={todo.id}
                    todo={todo}
                    editingId={editingId}
                    onToggle={onToggle}
                    onStartEdit={onStartEdit}
                    onSaveFull={onSaveFull}
                    onCancelEdit={onCancelEdit}
                    onDelete={onDelete}
                    formatDate={formatDate}
                    getPriorityColor={getPriorityColor}
                  />
                ))}
          </VStack>
        )}
      </Box>

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
                {completedTodos.map((todo) => (
                  <TaskCard
                    key={todo.id}
                    todo={todo}
                    editingId={editingId}
                    onToggle={onToggle}
                    onStartEdit={onStartEdit}
                    onSaveFull={onSaveFull}
                    onCancelEdit={onCancelEdit}
                    onDelete={onDelete}
                    showDelete={true}
                    mutedIcons={true}
                    formatDate={formatDate}
                    getPriorityColor={getPriorityColor}
                  />
                ))}
              </VStack>
            </Box>
          </Collapse>
        </Box>
      )}
    </>
  );
};

export default TaskListView;
