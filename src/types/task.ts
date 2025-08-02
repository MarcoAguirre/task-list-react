export interface Task {
  id: number;
  name: string;
  status: 'Por hacer' | 'En progreso' | 'Completada';
  priority: 'Baja' | 'Media' | 'Alta';
  image_url?: string;
  due_date: string;
  description?: string;
}
