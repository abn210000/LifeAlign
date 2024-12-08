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

// Check for screen title rendering
test('should render Edit Existing Task screen title', async () => {
  const mockSearchParams = { taskId: "1" };
  (useLocalSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

  let testTask = await getNewTask();
  let initalTasks = [ testTask ];
  await TaskService.setTasks(initalTasks);

    const { getByText } = render(
        <TaskProvider initialTasks={initalTasks} initialSelectedDate={initialSelectedDate}>
            <EditExistingTaskScreen />
        </TaskProvider>
    );

    await waitFor(() => {
      expect(getByText('Save Changes')).toBeTruthy();
    });
  });


// Check editing task screen
test('should display task details for editing', async () => {
  const mockSearchParams = { taskId: "1" };
  (useLocalSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

  let testTask = await getNewTask();
  let initalTasks = [ testTask ];

  const { getByDisplayValue } = render(
    <TaskProvider initialTasks={initalTasks} initialSelectedDate={initialSelectedDate}>
      <EditExistingTaskScreen />
    </TaskProvider>
  );
  await waitFor(() => {
    expect(getByDisplayValue('Sample Task')).toBeTruthy();
  });
  // Assuming there's a task with a default title 'Sample Task' in context
});
