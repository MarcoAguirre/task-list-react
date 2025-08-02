import { useEffect, useState } from 'react';
import { getTasks } from '../services/taskService';
import type { Task } from '../types/task';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando tareas...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white shadow-md rounded p-4 border">
          <h2 className="text-lg font-semibold mb-2">{task.name}</h2>
          {task.image_url && (
            <img src={task.image_url} alt={task.name} className="mb-2 rounded" />
          )}
          <p className="text-sm">
            <strong>Estado:</strong> {task.status}
          </p>
          <p className="text-sm">
            <strong>Prioridad:</strong> {task.priority}
          </p>
        </div>
      ))}
    </div>
  );
}
