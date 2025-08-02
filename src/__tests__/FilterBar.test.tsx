import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from '../components/FilterBar';

describe('FilterBar', () => {
  it('calls onFilterChange when inputs change', async () => {
    const handleChange = jest.fn();
    render(<FilterBar onFilterChange={handleChange} />);
    const input = screen.getByPlaceholderText(/buscar/i);
    await userEvent.type(input, 'Tarea importante');

    expect(handleChange).toHaveBeenCalled();
  });

  it('renders select options', () => {
    render(<FilterBar onFilterChange={() => {}} />);
    const estadoOption = screen.getByText('Filtrar por estado');
    const prioridadOption = screen.getByText('Filtrar por prioridad');

    expect(estadoOption).not.toBeNull();
    expect(prioridadOption).not.toBeNull();
  });
});
