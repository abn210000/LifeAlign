import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '@/app/Screens/HomeScreen';
import { TaskProvider } from '@/app/src/context/TaskContext';

jest.mock("@expo/vector-icons", () => ({
    Feather: "",
    AntDesign: "",
    Ionicons: "",
  }));

// Checking for screen title rendering
test('should render LifeAlign title', async () => {
  const { getByText } = render(
    <TaskProvider>
      <HomeScreen />
    </TaskProvider>
  );
  await new Promise((r) => setTimeout(r, 1000));
  expect(getByText('Life Align')).toBeTruthy();
});

// Checking for task list rendering
test('should display tasks for selected date', async () => {
  const { getByText } = render(
    <TaskProvider>
      <HomeScreen />
    </TaskProvider>
  );
  await new Promise((r) => setTimeout(r, 1000));
  expect(getByText(/,/)).toBeTruthy();
});
