import { Container, Box, Heading, VStack, Text, Button } from '@chakra-ui/react';
import React from 'react';

interface HeroHeaderProps {
  userName?: string | null;
  onChangeUser: () => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ userName, onChangeUser }) => {
  return (
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
              onClick={onChangeUser}
              _hover={{ color: 'white' }}
            >
              Change user
            </Button>
          </VStack>
        )}
      </Container>
    </Box>
  );
};

export default HeroHeader;
