import './index.css';
import { TaskList } from './components/TaskList';

function App() {
  return (
    <main className="min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-center py-6">Lista de Tareas</h1>
      <TaskList />
    </main>
  );
}

export default App;
