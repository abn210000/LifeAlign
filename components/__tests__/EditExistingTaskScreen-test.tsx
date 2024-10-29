import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditExistingTaskScreen from '@/app/Screens/EditExistingTaskScreen';
import { TaskProvider } from '@/app/src/context/TaskContext';

// Check for screen title rendering
test('should render Edit Existing Task screen title', () => {
  const { getByText } = render(
    <TaskProvider>
      <EditExistingTaskScreen />
    </TaskProvider>
  );
  expect(getByText('Edit Task')).toBeTruthy();
});

// Check editing task screen
test('should display task details for editing', () => {
  const { getByDisplayValue } = render(
    <TaskProvider>
      <EditExistingTaskScreen />
    </TaskProvider>
  );
  expect(getByDisplayValue('Sample Task')).toBeTruthy();
  // Assuming there's a task with a default title 'Sample Task' in context
});

test('should save changes and navigate back to Home Screen', () => {
  const { getByText, getByLabelText } = render(
    <TaskProvider>
      <EditExistingTaskScreen />
    </TaskProvider>
  );
  fireEvent.changeText(getByLabelText('Enter Title'), 'Updated Task Title');
  fireEvent.press(getByText('Save Changes'));
  expect(getByText('Updated Task Title')).toBeTruthy();
  // Assuming the task title has been updated to 'Updated Task Title' in the context
});

// Deletion of the task
test('should delete the task when delete button is pressed', () => {
  const { getByText, queryByText } = render(
    <TaskProvider>
      <EditExistingTaskScreen />
    </TaskProvider>
  );
  fireEvent.press(getByText('Delete Task'));
  expect(queryByText('Sample Task')).toBeNull();
  // Assuming the task with title 'Sample Task' should no longer be in the list after deletion
});
