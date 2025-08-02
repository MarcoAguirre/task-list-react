import { useEffect, useState } from 'react';
import { getTasks } from '../services/taskService';
import type { Task } from '../types/task';

type GroupedTasks = Record<Task['status'], Task[]>;

function groupByStatus(tasks: Task[]): GroupedTasks {
  return {
    'Por hacer': tasks.filter((t) => t.status === 'Por hacer'),
    'En progreso': tasks.filter((t) => t.status === 'En progreso'),
    Completada: tasks.filter((t) => t.status === 'Completada'),
  };
}

export function GroupedTaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando tareas...</p>;

  const grouped = groupByStatus(tasks);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {Object.entries(grouped).map(([status, tasks]) => (
        <div key={status} className="bg-gray-100 rounded shadow-sm p-2">
          <h2 className="text-lg font-semibold text-center mb-2">{status}</h2>
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-3 rounded shadow border hover:shadow-md transition"
              >
                <p className="font-medium">{task.name}</p>
                <p className="text-sm text-gray-600">
                  {task.priority} - {new Date(task.due_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
