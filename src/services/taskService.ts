import type { Task } from '../types/task';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}?select=*`, {
    headers: {
      apikey: API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching tasks');
  }

  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      apikey: API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Error deleting task');
  }
}
