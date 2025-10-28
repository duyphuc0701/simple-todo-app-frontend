import { Input, Button, HStack, useToast } from '@chakra-ui/react';
import { useState } from 'react';

interface TodoInputProps {
  onAddTodo: (title: string) => Promise<void>;
}

export const TodoInput = ({ onAddTodo }: TodoInputProps) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: 'Please enter a task',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddTodo(title);
      setTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <HStack>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          size="lg"
          isDisabled={isSubmitting}
        />
        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          isLoading={isSubmitting}
          loadingText="Adding"
        >
          Add Task
        </Button>
      </HStack>
    </form>
  );
};