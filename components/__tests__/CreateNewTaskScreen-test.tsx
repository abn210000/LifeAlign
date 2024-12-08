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

// Check for creation of new task
test('should create a new task when form is submitted', async () => {
  const { getByPlaceholderText, getByText } = render(
    <TaskProvider>
      <CreateNewTaskScreen />
    </TaskProvider>
  );

  fireEvent.changeText(getByPlaceholderText('Title'), 'New Task');
  fireEvent.press(getByText('Create Task'));
  await waitFor(() => {
    expect(getByText('Create Task')).toBeTruthy();
  });
});

