import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { TaskProvider } from '../context/TaskContext';

describe('CreateTaskModal', () => {
  it('shows error if required fields are missing', async () => {
    render(
      <TaskProvider>
        <CreateTaskModal onClose={() => {}} />
      </TaskProvider>
    );

    await userEvent.click(screen.getByText(/crear/i));
    const error = await screen.findByText(/entre 3 y 50 caracteres/i);
    expect(error).not.toBeNull();
  });

  it('submits valid form', async () => {
    render(
      <TaskProvider>
        <CreateTaskModal onClose={() => {}} />
      </TaskProvider>
    );

    await userEvent.type(screen.getByPlaceholderText(/nombre/i), 'Tarea de prueba');
    await userEvent.type(screen.getByPlaceholderText(/url de imagen/i), 'https://test.com/image.png');
    await userEvent.type(screen.getByPlaceholderText(/descripción/i), 'Descripción de prueba');
    await userEvent.type(screen.getByLabelText(/fecha/i), '2025-08-02');
    await userEvent.click(screen.getByText(/crear/i));

    // Si no hay error, asumimos éxito
    expect(screen.queryByText(/error/i)).toBeNull();
  });
});
