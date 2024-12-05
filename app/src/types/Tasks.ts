export interface Task {
  id: string;
  title: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  alertType?: string;
  repeatNum?: number;
  repeatPeriod?: string;
  notifId: string[];
  deletedAt?: string;
}

export type NewTask = Omit<Task, 'id'>;