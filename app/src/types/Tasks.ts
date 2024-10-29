export interface Task {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  completed: boolean;
  alertType?: string;
  repeatNum?: number;
  repeatPeriod?: string;
}

export type NewTask = Omit<Task, 'id'>;