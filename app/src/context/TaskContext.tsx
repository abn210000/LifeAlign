// context/TaskContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../types/Tasks';
import { TaskService } from '../services/TaskService';
import moment from 'moment';

// Task context type
interface TaskContextType {
  tasks: Task[];
  selectedDate: string;
  isLoading: boolean;
  setSelectedDate: (date: string) => void;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
  markedDates: { [date: string]: { marked: boolean; selected?: boolean } };
}

//  Create task context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Task provider component
export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [isLoading, setIsLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked: boolean } }>({});

  // Refresh tasks
  const refreshTasks = async () => {
    try {
      setIsLoading(true);
      const allTasks = await TaskService.getAllTasks();
      const tasksForDate = allTasks.filter(task => 
        moment(task.date).format('YYYY-MM-DD') === selectedDate
      );
      setTasks(tasksForDate);
      
      // Update marked dates
      const dates = allTasks.reduce((acc, task) => {
        const date = moment(task.date).format('YYYY-MM-DD');
        acc[date] = { marked: true };
        return acc;
      }, {} as { [key: string]: { marked: boolean } });
      
      setMarkedDates(dates);
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update when selected date changes
  useEffect(() => {
    refreshTasks();
  }, [selectedDate]);

  //  Load tasks on initial render
  useEffect(() => {
    // Add listener for task updates
    const refreshListener = async () => {
      const updatedTasks = await TaskService.getAllTasks();
      setTasks(updatedTasks);
    };

    TaskService.addListener(refreshListener);

    // Initial load
    refreshListener();

    // Cleanup
    return () => {
      TaskService.removeListener(refreshListener);
    };
  }, []);

  // Add a new task
  const addTask = async (task: Omit<Task, 'id'>) => {
    await TaskService.addTask(task);
    await refreshTasks();
  };

  // Update a task
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    await TaskService.updateTask(taskId, updates);
    await refreshTasks();
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    await TaskService.deleteTask(taskId);
    await refreshTasks();
  };

  //  Return provider with context value
  return (
    <TaskContext.Provider
      value={{
        tasks,
        selectedDate,
        isLoading,
        setSelectedDate,
        addTask,
        updateTask,
        deleteTask,
        refreshTasks,
        markedDates
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

//  Custom hook to use task context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};