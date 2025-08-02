import './index.css';
import { GroupedTaskList } from './components/GroupedTaskList';

function App() {
  return (
    <main className="min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-center py-6">Lista de Tareas</h1>
      <GroupedTaskList />
    </main>
  );
}

export default App;
