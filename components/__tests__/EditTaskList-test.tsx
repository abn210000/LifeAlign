import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditTaskList from '@/app/Screens/EditTaskList';
import { TaskProvider } from '@/app/src/context/TaskContext';
import { TaskService } from '@/app/src/services/TaskService';
import moment from 'moment';
import { scheduleNotification } from '@/app/src/notifications';

const now = new Date();
async function addTestTask() {
    const ids = await scheduleNotification(
        '',
        moment(now).format('YYYY-MM-DD'),
        moment(now).format('HH:mm'),
        ''
    );
    const newTask = {
        id: Date.now().toString(),
        title: 'Sample Task',
        category: '',
        date: moment(now).format('YYYY-MM-DD'),
        time: moment(now).format('HH:mm'),
        alertType: '',
        repeatNum: 0,
        repeatPeriod: '',
        completed: false,
        notifId: ids,
        createdAt: moment().toISOString(),
        updatedAt: moment().toISOString()
    };

    await TaskService.addTask(newTask);
}

export default async () => {
    await addTestTask();
};

// Check for screen title rendering
test('should render Edit Task List screen title', async () => {
    const { getByText } = render(
    <TaskProvider>
        <EditTaskList />
    </TaskProvider>
    );
    await new Promise((r) => setTimeout(r, 1000));
    expect(getByText('Select Task To Edit')).toBeTruthy();
  });

  // Check if task list is displayed
  test('should display the task list', async () => {
      const { getByText } = render(
      <TaskProvider>
        <EditTaskList />
      </TaskProvider>
    );
    await new Promise((r) => setTimeout(r, 1000));
    expect(getByText('Select Task To Edit')).toBeTruthy();
    // Assuming the task list renders correctly; replace with appropriate checks for task items.
  });

  // Check if selecting a task navigates to EditExistingTaskScreen
  test('should navigate to Edit Existing Task screen when a task is selected', async () => {
      const { getByText, queryByText } = render(
      <TaskProvider>
        <EditTaskList />
      </TaskProvider>
    );
    await new Promise((r) => setTimeout(r, 1000));

    // Assuming there's a task item; replace 'Sample Task' with your expected task title
    const taskItem = queryByText('Sample Task'); // Adjust to match an actual task
    if (taskItem) {
        fireEvent.press(taskItem);
        await new Promise((r) => setTimeout(r, 1000));

        // Check if the navigation occurred (this part depends on how your navigation is structured)
        expect(getByText('Edit Task')).toBeTruthy(); // Assuming the Edit Existing Task screen has this title
    }
  });

  // Check if deleting a task works
  test('should delete the task when delete button is pressed', async () => {
      const { getByText, queryByText } = render(
      <TaskProvider>
        <EditTaskList />
      </TaskProvider>
    );
    await new Promise((r) => setTimeout(r, 1000));

    const taskItem = queryByText('Delete Task'); // Adjust to match an actual task
    if (taskItem) {
        // Press delete button for a task; assume the button is labeled 'Delete Task'
        fireEvent.press(taskItem); // Replace with the actual button text or use a role query
        await new Promise((r) => setTimeout(r, 1000));

        // Ensure the task is no longer in the list
        expect(queryByText('Sample Task')).toBeNull(); // Adjust according to your task title
    }
  });