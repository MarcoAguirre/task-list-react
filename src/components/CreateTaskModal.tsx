import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

interface Props {
  onClose: () => void;
}

export function CreateTaskModal({ onClose }: Props) {
  const { addTask } = useTaskContext();
  const [form, setForm] = useState({
    name: '',
    priority: 'Baja',
    due_date: '',
    description: '',
    image_url: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (form.name.trim().length < 3 || form.name.trim().length > 50) {
      setError('El nombre debe tener entre 3 y 50 caracteres');
      return;
    }
    if (!form.due_date) {
      setError('La fecha de entrega es obligatoria');
      return;
    }

    const validPriorities = ['Baja', 'Media', 'Alta'];
    if (!validPriorities.includes(form.priority)) {
      setError('El valor de prioridad no es válido.');
      return;
    }

    try {
      await addTask({
        ...form,
        name: form.name.trim(),
        status: 'Por hacer',
        priority: form.priority as 'Baja' | 'Media' | 'Alta',
      });
      onClose();
    } catch (err) {
      console.error(err);
      setError('Error al crear la tarea');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Crear nueva tarea</h2>
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
        <input
          type="text"
          name="image_url"
          placeholder="URL de imagen (opcional)"
          className="border p-2 w-full mb-2"
          value={form.image_url}
          onChange={handleChange}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}
