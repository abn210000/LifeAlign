import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreateNewTaskScreen from '@/app/Screens/CreateNewTaskScreen';
import { TaskProvider } from '@/app/src/context/TaskContext';

// Check for screen title rendering
test('should render Create New Task screen title', () => {
  const { getByText } = render(
    <TaskProvider>
      <CreateNewTaskScreen />
    </TaskProvider>
  );
  expect(getByText('Create New Task')).toBeTruthy();
});

// Check for creation of new task
test('should create a new task when form is submitted', () => {
  const { getByPlaceholderText, getByText } = render(
    <TaskProvider>
      <CreateNewTaskScreen />
    </TaskProvider>
  );
  fireEvent.changeText(getByPlaceholderText('Enter Title'), 'New Task');
  fireEvent.press(getByText('Create Task'));

  expect(getByText('New Task')).toBeTruthy();
});

// Check navigation
test('should navigate back to Home Screen when back arrow is pressed', () => {
  const { getByLabelText } = render(
    <TaskProvider>
      <CreateNewTaskScreen />
    </TaskProvider>
  );

  fireEvent})
