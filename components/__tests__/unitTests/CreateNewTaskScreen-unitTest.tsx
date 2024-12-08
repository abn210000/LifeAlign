// Written by: Evelyn Tran
// Tested by: Linh Tran
// Debugged by: Allison Nguyen
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateNewTaskScreen from '@/app/Screens/CreateNewTaskScreen';
import { TaskProvider } from '@/app/src/context/TaskContext';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useRouter() {
    return {
      push: () => jest.fn(),
      replace: () => jest.fn(),
      back: () => jest.fn(),
    };
  }
}));

// Check for screen title rendering
test('should render Create New Task screen title', async () => {
  const { getByText } = render(
    <TaskProvider>
      <CreateNewTaskScreen />
    </TaskProvider>
  );
  await waitFor(() => {
    expect(getByText('Create Task')).toBeTruthy();
  });
});
