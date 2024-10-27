// services/TaskService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/Tasks';

const TASKS_STORAGE_KEY = '@life_align_tasks';

// Task service class
export class TaskService {
  static async getAllTasks(): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  // Get tasks by date
  static async getTasksByDate(date: string): Promise<Task[]> {
    try {
      const tasks = await this.getAllTasks();
      return tasks.filter(task => task.date === date);
    } catch (error) {
      console.error('Error getting tasks for date:', error);
      return [];
    }
  }

  // Get a single task by ID
  static async getTask(taskId: string): Promise<Task | null> {
    try {
      const tasks = await this.getAllTasks();
      const task = tasks.find(task => task.id === taskId);
      return task || null;
    } catch (error) {
      console.error('Error getting task:', error);
      return null;
    }
  }

  // Add a new task
  static async addTask(task: Omit<Task, 'id'>): Promise<Task> {
    try {
      const tasks = await this.getAllTasks();
      const newTask = {
        ...task,
        id: Date.now().toString(), // Simple ID generation
      };
      tasks.push(newTask);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }

  // Update a task
  static async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    try {
      const tasks = await this.getAllTasks();
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      const updatedTask = { ...tasks[taskIndex], ...updates };
      tasks[taskIndex] = updatedTask;
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // Delete a task
  static async deleteTask(taskId: string): Promise<void> {
    try {
      const tasks = await this.getAllTasks();
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(filteredTasks));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  //  Get dates with tasks
  static async getDatesWithTasks(): Promise<{ [date: string]: { marked: boolean } }> {
    try {
      const tasks = await this.getAllTasks();
      const markedDates: { [date: string]: { marked: boolean } } = {};
      
      tasks.forEach(task => {
        markedDates[task.date] = { marked: true };
      });
      
      return markedDates;
    } catch (error) {
      console.error('Error getting dates with tasks:', error);
      return {};
    }
  }
}