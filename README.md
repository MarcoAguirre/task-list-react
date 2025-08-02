# Task Manager App

Una aplicación de gestión de tareas construida con **React + Vite**, diseñada para permitir crear, editar, eliminar, filtrar y reorganizar tareas mediante arrastrar y soltar.

---

## Tecnologías

- ⚛️ React + TypeScript
- ⚡ Vite
- 🎨 TailwindCSS
- 🧠 Context API + useReducer
- 💾 Persistencia con localStorage
- 🧩 Drag & Drop con @dnd-kit
- ✅ Testing con Jest + React Testing Library

---

## 📂 Estructura del proyecto
```
src/
├── components/ # Componentes de UI
├── context/ # Context API para manejo global del estado
├── services/ # Conexión con API REST
├── types/ # Tipado de datos
├── test/ # Setup global de testing
```

## 🔧 Instalación

```bash
git clone https://github.com/tuusuario/task-manager.git
cd task-manager
npm install
npm run dev
```
El servidor backend debe estar corriendo y disponible en .env como VITE_API_URL y VITE_API_KEY.

## 🧪 Testing
```bash
npx jest
```

## 📌 Funcionalidades
- Crear y editar tareas con validaciones

- Eliminar tareas

- Agrupar por estado: Por hacer, En progreso, Completada

- Drag & Drop entre columnas

- Filtro combinado: nombre, estado, prioridad, fecha

- Persistencia en localStorage

- Tests unitarios de componentes clave
