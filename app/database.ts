/*import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('lifealign.db');

export interface Task {
  id?: number;
  title: string;
  category: string;
  date: string;
  time: string;
  alertType: string;
  repeatNum: number;
  repeatPeriod: string;
  completed: boolean;
}

export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          category TEXT,
          date TEXT,
          time TEXT,
          alertType TEXT,
          repeatNum INTEGER,
          repeatPeriod TEXT,
          completed INTEGER
        )`,
        [],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const insertTask = (task: Task): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO tasks (title, category, date, time, alertType, repeatNum, repeatPeriod, completed)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [task.title, task.category, task.date, task.time, task.alertType, task.repeatNum, task.repeatPeriod, task.completed ? 1 : 0],
        (_, result) => resolve(result.insertId),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const updateTask = (task: Task): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE tasks SET title = ?, category = ?, date = ?, time = ?, alertType = ?, repeatNum = ?, repeatPeriod = ?, completed = ?
         WHERE id = ?`,
        [task.title, task.category, task.date, task.time, task.alertType, task.repeatNum, task.repeatPeriod, task.completed ? 1 : 0, task.id],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deleteTask = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM tasks WHERE id = ?',
        [id],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const fetchTasks = (): Promise<Task[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks',
        [],
        (_, { rows }) => {
          const tasks: Task[] = [];
          for (let i = 0; i < rows.length; i++) {
            tasks.push({
              ...rows.item(i),
              completed: rows.item(i).completed === 1
            });
          }
          resolve(tasks);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const fetchTasksByDate = (date: string): Promise<Task[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks WHERE date = ?',
        [date],
        (_, { rows }) => {
          const tasks: Task[] = [];
          for (let i = 0; i < rows.length; i++) {
            tasks.push({
              ...rows.item(i),
              completed: rows.item(i).completed === 1
            });
          }
          resolve(tasks);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};*/