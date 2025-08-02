import type { Task } from '../types/task';

const API_URL = 'https://zctpzslxpvkuuxxsogco.supabase.co/rest/v1/tasks';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdHB6c2x4cHZrdXV4eHNvZ2NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEzNDAsImV4cCI6MjA2OTU0NzM0MH0.hWttk7qTfmGabO2_YaCWljodRyhi-5jbRV9q2Y_XnKI';

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
