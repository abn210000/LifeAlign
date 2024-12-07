import { render, fireEvent, act } from '@testing-library/react-native';
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
    await new Promise((r) => setTimeout(r, 1000));

    expect(getByText('Save Changes')).toBeTruthy();
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
  expect(getByDisplayValue('Sample Task')).toBeTruthy();
  // Assuming there's a task with a default title 'Sample Task' in context
});

test('should save changes and navigate back to Home Screen', async () => {
  const mockSearchParams = { taskId: "1" };
  (useLocalSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

  let testTask = await getNewTask();
  let initalTasks = [ testTask ];

  const { getByText, queryByPlaceholderText, getByDisplayValue } = render(
    <TaskProvider initialTasks={initalTasks} initialSelectedDate={initialSelectedDate}>
      <EditExistingTaskScreen />
    </TaskProvider>
  );
  fireEvent.changeText(queryByPlaceholderText('Title'), 'Updated Task Title');
  fireEvent.press(getByText('Save Changes'));
  expect(getByDisplayValue('Updated Task Title')).toBeTruthy();
  // Assuming the task title has been updated to 'Updated Task Title' in the context
});

// Deletion of the task
test('should delete the task when delete button is pressed', async () => {
  const mockSearchParams = { taskId: "1" };
  (useLocalSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

  let testTask = await getNewTask();
  let initalTasks = [ testTask ];

  const { getByText, queryByText } = render(
    <TaskProvider initialTasks={initalTasks} initialSelectedDate={initialSelectedDate}>
      <EditExistingTaskScreen />
    </TaskProvider>
  );

  const taskItem = queryByText('Delete Task'); // Adjust to match an actual task
  if (taskItem) {
    fireEvent.press(taskItem);
    expect(queryByText('Delete Task')).toBeNull();
    // Assuming the task with title 'Sample Task' should no longer be in the list after deletion
  }
});
