import { useState } from 'react';
import type { Task } from '../types/task';
import { updateTask } from '../services/taskService';

interface Props {
  task: Task;
  onClose: () => void;
  onUpdated: (task: Task) => void;
}

export function EditTaskModal({ task, onClose, onUpdated }: Props) {
  const [form, setForm] = useState({
    name: task.name,
    priority: task.priority,
    status: task.status,
    due_date: task.due_date,
    description: task.description || '',
    image_url: task.image_url || '',
  });

  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (form.name.trim().length < 3 || form.name.trim().length > 50) {
      setError('El nombre debe tener entre 3 y 50 caracteres');
      return;
    }

    try {
      const updated = await updateTask(task.id, {
        ...form,
        name: form.name.trim(),
        priority: form.priority as Task['priority'],
        status: form.status as Task['status'],
      });

      onUpdated(updated);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Error al actualizar la tarea');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Editar tarea</h2>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          className="border p-2 w-full mb-2"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="date"
          name="due_date"
          className="border p-2 w-full mb-2"
          value={form.due_date}
          onChange={handleChange}
        />
        <select
          name="priority"
          className="border p-2 w-full mb-2"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
        <select
          name="status"
          className="border p-2 w-full mb-2"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Por hacer">Por hacer</option>
          <option value="En progreso">En progreso</option>
          <option value="Completada">Completada</option>
        </select>
        <input
          type="text"
          name="image_url"
          placeholder="URL de imagen (opcional)"
          className="border p-2 w-full mb-2"
          value={form.image_url}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Descripción (opcional)"
          className="border p-2 w-full mb-2"
          value={form.description}
          onChange={handleChange}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
