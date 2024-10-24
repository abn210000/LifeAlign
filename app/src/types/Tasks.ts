export interface Task {
    id: string;
    title: string;
    category: string;
    date: string; // YYYY-MM-DD format
    time: string;
    alertType: string;
    repeatNum: number;
    repeatPeriod: string;
    completed: boolean;
  }
  