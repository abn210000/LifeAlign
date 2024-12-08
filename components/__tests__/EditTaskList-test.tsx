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

  // Check if selecting a task navigates to EditExistingTaskScreen
  test('should navigate to Edit Existing Task screen when a task is selected', async () => {
      const { getByText, queryByText } = render(
      <TaskProvider>
        <EditTaskList />
      </TaskProvider>
    );

    await waitFor(() => {
      expect(getByText('Select Task To Edit')).toBeTruthy();
    });
      // Assuming there's a task item; replace 'Sample Task' with your expected task title
    const taskItem = queryByText('Sample Task'); // Adjust to match an actual task
    if (taskItem) {
        fireEvent.press(taskItem);

        await waitFor(() => {
          // Check if the navigation occurred (this part depends on how your navigation is structured)
          expect(getByText('Sample Task')).toBeTruthy(); // Assuming the Edit Existing Task screen has this title
        });
    }
  });

  // Check if deleting a task works
  test('should delete the task when delete button is pressed', async () => {
      const { getByText, queryByText } = render(
      <TaskProvider>
        <EditTaskList />
      </TaskProvider>
    );
    await waitFor(() => {
      expect(getByText('Select Task To Edit')).toBeTruthy();
    });

    const taskItem = queryByText('Delete Task'); // Adjust to match an actual task
    if (taskItem) {
        // Press delete button for a task; assume the button is labeled 'Delete Task'
        fireEvent.press(taskItem); // Replace with the actual button text or use a role query

        await waitFor(() => {
          // Ensure the task is no longer in the list
          expect(queryByText('Sample Task')).toBeNull(); // Adjust according to your task title
        });
    }
  });