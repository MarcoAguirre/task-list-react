import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditTaskModal } from '../components/EditTaskModal';
import { TaskProvider } from '../context/TaskContext';
import { type Task } from '../types/task';

const sampleTask: Task = {
  id: 1,
  name: 'Tarea original',
  status: 'Por hacer',
  due_date: '2025-08-05',
  priority: 'Media',
  description: 'Original desc',
  image_url: '',
};

describe('EditTaskModal', () => {
  it('shows initial values and updates correctly', async () => {
    render(
      <TaskProvider>
        <EditTaskModal task={sampleTask} onClose={() => {}} />
      </TaskProvider>
    );

    const nameInput = screen.getByDisplayValue('Tarea original');
    expect(nameInput).not.toBeNull();

    await userEvent.clear(nameInput);
    await userEvent.type(screen.getByPlaceholderText(/nombre/i), 'Nueva tarea');
    await userEvent.click(screen.getByText(/guardar/i));

    expect(screen.queryByText(/error/i)).toBeNull();
  });
});
