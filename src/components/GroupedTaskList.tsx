import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import type { Task } from '../types/task';
import { useTaskContext } from '../context/TaskContext';
import { CreateTaskModal } from './CreateTaskModal';
import { EditTaskModal } from './EditTaskModal';
import { DroppableColumn } from './DroppableColumn';
import { FilterBar } from './FilterBar';

function groupByStatus(tasks: Task[]) {
  return {
    'Por hacer': tasks.filter((t) => t.status === 'Por hacer'),
    'En progreso': tasks.filter((t) => t.status === 'En progreso'),
    Completada: tasks.filter((t) => t.status === 'Completada'),
  };
}

export function GroupedTaskList() {
  const { tasks, addTask, updateTaskById, deleteTaskById } = useTaskContext();

  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    dueDate: '',
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedId = parseInt(active.id as string);
    const newStatus = over.id as Task['status'];
    const task = tasks.find((t) => t.id === draggedId);
    if (!task || task.status === newStatus) return;

    try {
      await updateTaskById(task.id, { status: newStatus });
    } catch (err) {
      console.error(err);
      alert('Error al actualizar tarea');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchSearch = task.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = filters.status ? task.status === filters.status : true;
    const matchPriority = filters.priority ? task.priority === filters.priority : true;
    const matchDueDate = filters.dueDate ? task.due_date === filters.dueDate : true;
    return matchSearch && matchStatus && matchPriority && matchDueDate;
  });

  const grouped = groupByStatus(filteredTasks);

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
              onTaskDelete={deleteTaskById}
            />
          ))}
        </div>
      </DndContext>
      {showModal && <CreateTaskModal onClose={() => setShowModal(false)} onCreated={addTask} />}
      {taskToEdit && (
        <EditTaskModal
          task={taskToEdit}
          onClose={() => setTaskToEdit(null)}
          onUpdated={(updated) => updateTaskById(updated.id, updated)}
        />
      )}
    </>
  );
}
