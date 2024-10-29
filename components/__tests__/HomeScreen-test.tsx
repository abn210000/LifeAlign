import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '@/app/Screens/HomeScreen';
import { TaskProvider } from '@/app/src/context/TaskContext';

// Checking for screen title rendering
test('should render LifeAlign title', () => {
  const { getByText } = render(
    <TaskProvider>
      <HomeScreen />
    </TaskProvider>
  );
  expect(getByText('Life Align')).toBeTruthy();
});

// Checking for task list rendering
test('should display tasks for selected date', () => {
  const { getByText } = render(
    <TaskProvider>
      <HomeScreen />
    </TaskProvider>
  );
  expect(getByText('Current Task List')).toBeTruthy();
});
