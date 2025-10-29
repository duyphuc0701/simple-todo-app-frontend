import { useState } from 'react';
import { Box, Heading, Input, Button, VStack, Text, HStack, useToast } from '@chakra-ui/react';

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
    <Box maxW="md" mx="auto" mt={12} p={6} bg="white" borderRadius="md" boxShadow="sm">
      <VStack spacing={4} align="stretch">
        <Heading size="md">Welcome</Heading>
        <Text color="gray.600">Enter your name to continue to your Todo list.</Text>

        <form onSubmit={handleSubmit}>
          <HStack>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              size="md"
              isDisabled={isSubmitting}
            />
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
            >
              Continue
            </Button>
          </HStack>
        </form>
      </VStack>
    </Box>
  );
};

export default NameEntry;
