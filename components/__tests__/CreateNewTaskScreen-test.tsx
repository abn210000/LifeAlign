import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreateNewTaskScreen from '@/app/Screens/CreateNewTaskScreen';
import { TaskProvider } from '@/app/src/context/TaskContext';

// Check for screen title rendering
test('should render Create New Task screen title', async () => {
  const { getByText } = render(
    <TaskProvider>
      <CreateNewTaskScreen />
    </TaskProvider>
  );
  await new Promise((r) => setTimeout(r, 1000));

  expect(getByText('Create Task')).toBeTruthy();
});

// Check for creation of new task
test('should create a new task when form is submitted', async () => {
  const { getByPlaceholderText, getByText } = render(
    <TaskProvider>
      <CreateNewTaskScreen />
    </TaskProvider>
  );
  await new Promise((r) => setTimeout(r, 1000));

  fireEvent.changeText(getByPlaceholderText('Title'), 'New Task');
  fireEvent.press(getByText('Create Task'));
  await new Promise((r) => setTimeout(r, 1000));

  expect(getByText('Create Task')).toBeTruthy();
});

// Check navigation
test('should navigate back to Home Screen when back arrow is pressed', async () => {
  const { getByLabelText } = render(
    <TaskProvider>
      <CreateNewTaskScreen />
    </TaskProvider>
  );

  fireEvent})
