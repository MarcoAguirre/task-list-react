import { useDraggable } from '@dnd-kit/core';
import type { Task } from '../types/task';

interface Props {
  task: Task;
  onClick: () => void;
  onDelete: (id: number) => void;
}

export function DraggableTaskCard({ task, onClick, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id.toString(),
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={onClick}
      className="bg-white p-3 rounded shadow border hover:shadow-md transition relative cursor-move"
    >
      <p className="font-medium mt-5">{task.name}</p>
      <p className="text-sm text-gray-600">
        {task.priority} - {new Date(task.due_date).toLocaleDateString()}
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="absolute top-2 right-2 text-sm bg-red-600 text-white rounded w-6 h-6 flex items-center justify-center hover:bg-red-700"
      >
        X
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="absolute top-2 left-2 bg-blue-600 text-white rounded w-6 h-6 flex items-center justify-center text-sm hover:bg-blue-700"
      >
        ✎
      </button>
    </div>
  );
}
