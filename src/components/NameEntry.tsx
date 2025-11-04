import { useState } from 'react';
import { Box, Heading, Input, Button, VStack, Text, useToast } from '@chakra-ui/react';

interface NameEntryProps {
  onSaveName: (name: string) => Promise<void> | void;
}

export const NameEntry = ({ onSaveName }: NameEntryProps) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) {
      toast({ title: 'Please enter your name', status: 'warning', duration: 2000 });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaveName(name.trim());
    } catch (err) {
      toast({ title: 'Unable to save name', status: 'error', duration: 2500 });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name..."
            size="lg"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            autoFocus
            isDisabled={isSubmitting}
          />
          <Button
            colorScheme="green"
            w="full"
            size="lg"
            onClick={() => handleSubmit()}
            isLoading={isSubmitting}
          >
            Start
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default NameEntry;
