import { useDroppable } from '@dnd-kit/core';
import type { Task } from '../types/task';
import { DraggableTaskCard } from './DraggableTaskCard';

interface Props {
  id: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (id: number) => void;
}

export function DroppableColumn({ id, tasks, onTaskClick, onTaskDelete }: Props) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="bg-gray-100 rounded shadow-sm p-2 min-h-[300px]">
      <h2 className="text-lg font-semibold text-center mb-2">{id}</h2>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <DraggableTaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} onDelete={onTaskDelete} />
        ))}
      </div>
    </div>
  );
}
