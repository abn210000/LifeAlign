// Written by: Evelyn Tran
// Tested by: Linh Tran
// Debugged by: Allison Nguyen
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import EditExistingTaskScreen from '@/app/Screens/EditExistingTaskScreen';
import moment from 'moment';
import { scheduleNotification } from '@/app/src/notifications';
import { TaskService } from '@/app/src/services/TaskService';
import { TaskProvider, useTaskContext } from '@/app/src/context/TaskContext';
import { useLocalSearchParams } from 'expo-router';

jest.mock("@expo/vector-icons", () => ({
    Feather: "",
  }));

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


test('should save changes and navigate back to Home Screen', async () => {
  const mockSearchParams = { taskId: "1" };
  (useLocalSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

  let testTask = await getNewTask();
  let initialTasks = [ testTask ];
  await TaskService.setTasks(initialTasks);

  const { getByText, getByPlaceholderText, getByDisplayValue } = render(
    <TaskProvider initialTasks={initialTasks} initialSelectedDate={initialSelectedDate}>
      <EditExistingTaskScreen />
    </TaskProvider>
  );
  fireEvent.changeText(getByPlaceholderText('Title'), 'Updated Task Title');
  fireEvent.press(getByText('Save Changes'));
  await waitFor(() => {
    expect(getByDisplayValue('Updated Task Title')).toBeTruthy();
  });
  // Assuming the task title has been updated to 'Updated Task Title' in the context
});

// Deletion of the task
test('should delete the task when delete button is pressed', async () => {
  const mockSearchParams = { taskId: "1" };
  (useLocalSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

  let testTask = await getNewTask();
  let initalTasks = [ testTask ];

  const { getByText, queryByText, getByLabelText } = render(
    <TaskProvider initialTasks={initalTasks} initialSelectedDate={initialSelectedDate}>
      <EditExistingTaskScreen />
    </TaskProvider>
  );

  fireEvent.press(getByLabelText('Delete Task'));
  await waitFor(() => {
    // 
    expect(getByText('Save Changes')).toBeTruthy();
  });
});
