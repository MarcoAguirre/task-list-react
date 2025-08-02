import { createContext, useContext, useEffect, useReducer } from 'react';
import type { Task } from '../types/task';
import {
  getTasks,
  createTask as apiCreateTask,
  updateTask,
  deleteTask,
} from '../services/taskService';

type Action =
  | { type: 'set'; payload: Task[] }
  | { type: 'add'; payload: Task }
  | { type: 'update'; payload: { id: number; data: Partial<Omit<Task, 'id'>> } }
  | { type: 'delete'; payload: number };

interface TaskContextType {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTaskById: (id: number, data: Partial<Omit<Task, 'id'>>) => Promise<void>;
  deleteTaskById: (id: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'tasks';

const reducer = (state: Task[], action: Action): Task[] => {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return [...state, action.payload];
    case 'update':
      return state.map((task) =>
        task.id === action.payload.id ? { ...task, ...action.payload.data } : task
      );
    case 'delete':
      return state.filter((task) => task.id !== action.payload);
    default:
      return state;
  }
};

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, dispatch] = useReducer(reducer, []);

  const persist = (tasks: Task[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  };

  const fetchTasks = async () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      dispatch({ type: 'set', payload: JSON.parse(stored) });
    } else {
      const data = await getTasks();
      dispatch({ type: 'set', payload: data });
      persist(data);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id'>) => {
    const newTask = await apiCreateTask(taskData);
    dispatch({ type: 'add', payload: newTask });
    persist([...tasks, newTask]);
  };

  const updateTaskById = async (id: number, data: Partial<Omit<Task, 'id'>>) => {
    await updateTask(id, data);
    dispatch({ type: 'update', payload: { id, data } });
    persist(
      tasks.map((task) => (task.id === id ? { ...task, ...data } : task))
    );
  };

  const deleteTaskById = async (id: number) => {
    await deleteTask(id);
    dispatch({ type: 'delete', payload: id });
    persist(tasks.filter((task) => task.id !== id));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{ tasks, fetchTasks, addTask, updateTaskById, deleteTaskById }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
};
