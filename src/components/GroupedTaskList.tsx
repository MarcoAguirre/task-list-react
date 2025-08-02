import { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '../services/taskService';
import { CreateTaskModal } from './CreateTaskModal';
import { EditTaskModal } from './EditTaskModal';
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
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando tareas...</p>;

  const grouped = groupByStatus(tasks);

  async function handleDelete(id: number) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error al eliminar la tarea:', err);
      alert('Error al eliminar la tarea');
    }
  }

  return (
    <>
      <div className="flex justify-start px-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add task
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {Object.entries(grouped).map(([status, tasks]) => (
          <div key={status} className="bg-gray-100 rounded shadow-sm p-2">
            <h2 className="text-lg font-semibold text-center mb-2">{status}</h2>
            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded shadow border hover:shadow-md transition relative"
                >
                  <p className="font-medium mt-4">{task.name}</p>
                  <p className="text-sm text-gray-600">
                    {task.priority} - {new Date(task.due_date).toLocaleDateString()}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task.id);
                    }}
                    className="absolute top-2 right-2 text-sm bg-red-600 text-white rounded w-6 h-6 flex items-center justify-center hover:bg-red-700"
                  >
                    X
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTaskToEdit(task);
                    }}
                    className="absolute top-2 left-2 bg-blue-600 text-white rounded w-6 h-6 flex items-center justify-center text-sm hover:bg-blue-700"
                  >
                    ✎
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onCreated={(newTask) => setTasks((prev) => [...prev, newTask])}
        />
      )}
      {taskToEdit && (
        <EditTaskModal
          task={taskToEdit}
          onClose={() => setTaskToEdit(null)}
          onUpdated={(updatedTask) =>
            setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
          }
        />
      )}
    </>
  );
}
