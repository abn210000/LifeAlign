// Written by: Evelyn Tran
// Tested by: Linh Tran
// Debugged by: Allison Nguyen
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditTaskList from '@/app/Screens/EditTaskList';
import { TaskProvider } from '@/app/src/context/TaskContext';
import { TaskService } from '@/app/src/services/TaskService';
import moment from 'moment';
import { scheduleNotification } from '@/app/src/notifications';
import { useLocalSearchParams } from 'expo-router';

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

let initialSelectedDate = "";
async function getNewTask() {
    const now = new Date();
    const ids = await scheduleNotification(
        '',
        moment(now).format('YYYY-MM-DD'),
        moment(now).format('HH:mm'),
        ''
    );
    initialSelectedDate = moment(now).format('YYYY-MM-DD');
    const newTask = {
        id: "1",
        title: 'Sample Task',
        category: '',
        date: initialSelectedDate,
        time: moment(now).format('HH:mm'),
        alertType: '',
        repeatNum: 0,
        repeatPeriod: '',
        completed: false,
        notifId: ids,
        createdAt: moment().toISOString(),
        updatedAt: moment().toISOString()
  };
  return newTask;
}

// Check for screen title rendering
test('should render Edit Task List screen title', async () => {

  const mockSearchParams = { taskId: "1" };
  (useLocalSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

  let testTask = await getNewTask();
  let initalTasks = [ testTask ];
  await TaskService.setTasks(initalTasks);

    const { getByText } = render(
    <TaskProvider>
        <EditTaskList />
    </TaskProvider>
    );
    await waitFor(() => {
      expect(getByText('Select Task To Edit')).toBeTruthy();
    });
  });

  // Check if task list is displayed
  test('should display the task list', async () => {
      const { getByText } = render(
      <TaskProvider>
        <EditTaskList />
      </TaskProvider>
    );
    await waitFor(() => {
      expect(getByText('Select Task To Edit')).toBeTruthy();
    });
  });
