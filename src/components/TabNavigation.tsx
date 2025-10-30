import { HStack, Button } from '@chakra-ui/react';
import React from 'react';

type TabType = 'today' | 'pending' | 'overdue';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
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
  );
};

export default TabNavigation;
