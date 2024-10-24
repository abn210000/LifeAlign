// context/TaskContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../types/Tasks';
import { TaskService } from '../services/TaskService';

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

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [isLoading, setIsLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked: boolean } }>({});

  const refreshTasks = async () => {
    try {
      setIsLoading(true);
      const tasksForDate = await TaskService.getTasksByDate(selectedDate);
      setTasks(tasksForDate);
      const dates = await TaskService.getDatesWithTasks();
      setMarkedDates(dates);
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, [selectedDate]);

  const addTask = async (task: Omit<Task, 'id'>) => {
    await TaskService.addTask(task);
    await refreshTasks();
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    await TaskService.updateTask(taskId, updates);
    await refreshTasks();
  };

  const deleteTask = async (taskId: string) => {
    await TaskService.deleteTask(taskId);
    await refreshTasks();
  };

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

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};