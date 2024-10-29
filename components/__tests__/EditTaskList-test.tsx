import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditTaskList from '@/app/Screens/EditTaskList';
import { TaskProvider } from '@/app/src/context/TaskContext';

// Check for screen title rendering
test('should render Edit Task List screen title', () => {
    const { getByText } = render(
      <TaskProvider>
        <EditTaskList />
      </TaskProvider>
    );
    expect(getByText('Select Task To Edit')).toBeTruthy();
  });
  
  // Check if task list is displayed
  test('should display the task list', () => {
    const { getByText } = render(
      <TaskProvider>
        <EditTaskList />
      </TaskProvider>
    );
    expect(getByText('Select Task To Edit')).toBeTruthy();
    // Assuming the task list renders correctly; replace with appropriate checks for task items.
  });
  
  // Check if selecting a task navigates to EditExistingTaskScreen
  test('should navigate to Edit Existing Task screen when a task is selected', () => {
    const { getByText } = render(
      <TaskProvider>
        <EditTaskList />
      </TaskProvider>
    );
  
    // Assuming there's a task item; replace 'Sample Task' with your expected task title
    const taskItem = getByText('Sample Task'); // Adjust to match an actual task
    fireEvent.press(taskItem);
    
    // Check if the navigation occurred (this part depends on how your navigation is structured)
    expect(getByText('Edit Task')).toBeTruthy(); // Assuming the Edit Existing Task screen has this title
  });
  
  // Check if deleting a task works
  test('should delete the task when delete button is pressed', () => {
    const { getByText, queryByText } = render(
      <TaskProvider>
        <EditTaskList />
      </TaskProvider>
    );
  
    // Press delete button for a task; assume the button is labeled 'Delete Task'
    fireEvent.press(getByText('Delete Task')); // Replace with the actual button text or use a role query
    
    // Ensure the task is no longer in the list
    expect(queryByText('Sample Task')).toBeNull(); // Adjust according to your task title
  });