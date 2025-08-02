import { useState } from 'react';

interface Props {
  onFilterChange: (filters: {
    search: string;
    status: string;
    priority: string;
    dueDate: string;
  }) => void;
}

export function FilterBar({ onFilterChange }: Props) {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    dueDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 items-end">
      <input
        type="text"
        name="search"
        placeholder="Buscar por nombre"
        value={filters.search}
        onChange={handleChange}
        className="border p-2 rounded w-48"
      />
      <select name="status" value={filters.status} onChange={handleChange} className="border p-2 rounded">
        <option value="">Todos los estados</option>
        <option value="Por hacer">Por hacer</option>
        <option value="En progreso">En progreso</option>
        <option value="Completada">Completada</option>
      </select>
      <select name="priority" value={filters.priority} onChange={handleChange} className="border p-2 rounded">
        <option value="">Todas las prioridades</option>
        <option value="Baja">Baja</option>
        <option value="Media">Media</option>
        <option value="Alta">Alta</option>
      </select>
      <input
        type="date"
        name="dueDate"
        value={filters.dueDate}
        onChange={handleChange}
        className="border p-2 rounded"
      />
    </div>
  );
}
