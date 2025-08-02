import { useEffect, useState } from 'react';
import { getTasks, deleteTask, updateTask } from '../services/taskService';
import { CreateTaskModal } from './CreateTaskModal';
import { EditTaskModal } from './EditTaskModal';
import { DroppableColumn } from './DroppableColumn';
import { FilterBar } from './FilterBar';
import type { Task } from '../types/task';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

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

  const sensors = useSensors(useSensor(PointerSensor));
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    dueDate: '',
  });

  const filteredTasks = tasks.filter((task) => {
    const matchSearch = task.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = filters.status ? task.status === filters.status : true;
    const matchPriority = filters.priority ? task.priority === filters.priority : true;
    const matchDueDate = filters.dueDate ? task.due_date === filters.dueDate : true;
    return matchSearch && matchStatus && matchPriority && matchDueDate;
  });

  const grouped = groupByStatus(filteredTasks);

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error al eliminar la tarea:', err);
      alert('Error al eliminar la tarea');
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedTaskId = parseInt(active.id as string);
    const newStatus = over.id as Task['status'];

    const task = tasks.find((t) => t.id === draggedTaskId);
    if (!task || task.status === newStatus) return;

    try {
      const updated = await updateTask(task.id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? { ...t, status: newStatus } : t)));
    } catch (err) {
      console.error(err);
      alert('Error actualizando tarea');
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando tareas...</p>;

  return (
    <>
      <FilterBar onFilterChange={setFilters} />

      <div className="flex justify-start px-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add task
        </button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {Object.entries(grouped).map(([status, tasks]) => (
            <DroppableColumn
              key={status}
              id={status}
              tasks={tasks}
              onTaskClick={setTaskToEdit}
              onTaskDelete={handleDelete}
            />
          ))}
        </div>
      </DndContext>
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
