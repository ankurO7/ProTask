import React, { useState, useEffect, useCallback, useReducer, memo } from 'react';

// ================================================================================= //
// CONSTANTS & CONFIG
// ================================================================================= //

// For deployment, the app needs to know the URL of the live backend API.
// We use an environment variable for this. When you run `npm start` locally,
// it will fall back to your localhost address.
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const KANBAN_COLUMNS = ['To Do', 'In Progress', 'Done'];

const ACTION_TYPES = {
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

// ================================================================================= //
// STATE MANAGEMENT (Reducer)
// ================================================================================= //

const tasksReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_TASKS:
      return action.payload;
    case ACTION_TYPES.ADD_TASK:
      return [...state, action.payload];
    case ACTION_TYPES.DELETE_TASK:
      return state.filter(task => task._id !== action.payload.id);
    case ACTION_TYPES.UPDATE_TASK:
      return state.map(task =>
        task._id === action.payload._id ? { ...task, ...action.payload } : task
      );
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// ================================================================================= //
// API UTILITY
// ================================================================================= //

const api = {
  getTasks: () => fetch(`${API_BASE}/tasks`).then(res => res.json()),
  addTask: (task) => fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  }).then(res => res.json()),
  updateTask: (id, updates) => fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  }).then(res => res.json()),
  deleteTask: (id) => fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' }),
};

// ================================================================================= //
// ICON COMPONENTS
// ================================================================================= //

const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);
const EditIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const AppLogo = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z" clipRule="evenodd" /></svg>);

// ================================================================================= //
// UI COMPONENTS
// ================================================================================= //

const Modal = ({ isOpen, onClose, children }) => {
  const [show, setShow] = useState(isOpen);
  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 300); // Match duration of closing animation
    }
  }, [isOpen]);
  if (!show) return null;
  return (
    <div className={`fixed inset-0 z-50 flex justify-center items-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}>
      <div className={`bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const TaskCard = memo(({ task, onDelete, onDragStart, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteClick = () => { setIsDeleting(true); setTimeout(() => onDelete(task._id), 300); };
  const cardAccentColor = {
    'To Do': 'border-l-sky-400',
    'In Progress': 'border-l-yellow-400',
    'Done': 'border-l-green-400',
  }[task.status];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      className={`bg-slate-800/80 p-4 rounded-lg shadow-md border border-slate-700/50 cursor-grab active:cursor-grabbing transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${cardAccentColor} border-l-4 ${isDeleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-slate-100 pr-2 break-all">{task.title}</h4>
        <div className="flex-shrink-0 flex items-center space-x-2">
            <button onClick={() => onEdit(task)} className="text-slate-500 hover:text-sky-400 transition-colors opacity-60 hover:opacity-100"><EditIcon /></button>
            <button onClick={handleDeleteClick} className="text-slate-500 hover:text-red-400 transition-colors opacity-60 hover:opacity-100"><TrashIcon /></button>
        </div>
      </div>
      {task.description && <p className="text-sm text-slate-400 mt-2 break-words">{task.description}</p>}
    </div>
  );
});

const EmptyColumn = () => (
    <div className="flex flex-col items-center justify-center h-full p-4 border-2 border-dashed border-slate-700 rounded-lg text-center">
        <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
        <p className="text-slate-400 mt-2 text-sm">Drag tasks here or create a new one.</p>
    </div>
);

const KanbanColumn = ({ title, tasks, isDraggingOver, onDragOver, onDrop, onDelete, onDragStart, onDragEnter, onDragLeave, onEdit }) => {
  return (
    <div
      className={`flex-1 rounded-xl bg-slate-900/50 transition-colors duration-300 ${isDraggingOver ? 'bg-sky-900/40' : ''}`}
      onDragOver={onDragOver} onDrop={(e) => onDrop(e, title)}
      onDragEnter={(e) => onDragEnter(e, title)} onDragLeave={onDragLeave}
    >
      <div className="p-5">
          <h3 className="font-bold text-lg mb-4 text-slate-200 flex items-center justify-between">
              {title}
              <span className="text-sm font-medium text-slate-300 bg-slate-700 rounded-full px-2.5 py-1">{tasks.length}</span>
          </h3>
          <div className="space-y-4 min-h-[250px]">
            {tasks.length > 0 ? tasks.map(task => <TaskCard key={task._id} task={task} onDelete={onDelete} onDragStart={onDragStart} onEdit={onEdit} />) : <EmptyColumn />}
          </div>
      </div>
    </div>
  );
};

const TaskForm = ({ onTaskAdded, onTaskUpdated, existingTask, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(existingTask);

  useEffect(() => {
    if (isEditMode) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [existingTask, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) { setError('Title is required!'); return; }
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const updatedTask = await api.updateTask(existingTask._id, { title, description });
        onTaskUpdated(updatedTask);
      } else {
        const newTask = await api.addTask({ title, description, status: 'To Do' });
        onTaskAdded(newTask);
      }
      onClose();
    } catch (err) {
      console.error("Failed to save task:", err);
      setError('Failed to save task. Please try again.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-100 mb-6">{isEditMode ? 'Edit Task' : 'Add a New Task'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
          <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300">Title</label>
              <input id="title" type="text" placeholder="e.g., Design the new logo" value={title} onChange={(e) => { setTitle(e.target.value); setError(''); }} className="mt-1 w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
           <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300">Description</label>
              <textarea id="description" placeholder="Add more details... (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500" rows="4" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-3 pt-4">
               <button type="button" onClick={onClose} className="px-5 py-2 bg-slate-600/50 text-slate-100 font-semibold rounded-lg hover:bg-slate-600 transition-all">Cancel</button>
               <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800 transition-all disabled:bg-sky-400 disabled:bg-sky-800">{isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Task')}</button>
          </div>
      </form>
    </div>
  );
};

// ================================================================================= //
// MAIN APP COMPONENT
// ================================================================================= //

function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  
  const fetchTasks = useCallback(async () => {
    try {
      const data = await api.getTasks();
      dispatch({ type: ACTION_TYPES.SET_TASKS, payload: data });
    } catch (error) { console.error("Failed to fetch tasks:", error); }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleTaskAdded = (newTask) => dispatch({ type: ACTION_TYPES.ADD_TASK, payload: newTask });
  const handleTaskUpdated = (updatedTask) => dispatch({ type: ACTION_TYPES.UPDATE_TASK, payload: updatedTask });
  const handleDelete = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      dispatch({ type: ACTION_TYPES.DELETE_TASK, payload: { id: taskId } });
    } catch (error) { console.error("Failed to delete task:", error); }
  };
  const handleOpenEditModal = (task) => { setEditingTask(task); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingTask(null); };
  const handleDragStart = (e, taskId) => e.dataTransfer.setData("taskId", taskId);
  const handleDragEnd = () => setDragOverColumn(null);
  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnter = (e, columnTitle) => { e.preventDefault(); setDragOverColumn(columnTitle); };
  const handleDragLeave = (e) => e.preventDefault();
  const handleDrop = async (e, newStatus) => {
    const taskId = e.dataTransfer.getData("taskId");
    handleDragEnd();
    const taskToUpdate = tasks.find(task => task._id === taskId);
    if (!taskToUpdate || taskToUpdate.status === newStatus) return;
    const updatedTask = { ...taskToUpdate, status: newStatus };
    dispatch({ type: ACTION_TYPES.UPDATE_TASK, payload: updatedTask });
    try { await api.updateTask(taskId, { status: newStatus }); } catch (error) {
      console.error("Failed to update task status:", error);
      dispatch({ type: ACTION_TYPES.UPDATE_TASK, payload: taskToUpdate });
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen font-sans text-slate-100 transition-colors duration-300">
      <header className="bg-slate-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-10 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-3"><AppLogo /><h1 className="text-2xl font-bold text-slate-100">ProTask</h1></div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900 transition-all duration-200 transform hover:scale-105 shadow hover:shadow-md"><PlusIcon /><span>New Task</span></button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-fuchsia-500">
                    Chaos, Organized.
                </span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                Go from scattered ideas to a streamlined workflow. Drag, drop, and get it done.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" onDragEnd={handleDragEnd}>
            {KANBAN_COLUMNS.map(columnTitle => (
              <KanbanColumn
                key={columnTitle} title={columnTitle}
                tasks={tasks.filter(t => t.status === columnTitle)}
                isDraggingOver={dragOverColumn === columnTitle}
                onDragOver={handleDragOver} onDrop={handleDrop}
                onDelete={handleDelete} onDragStart={handleDragStart}
                onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
                onEdit={handleOpenEditModal}
              />
            ))}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <TaskForm existingTask={editingTask} onTaskAdded={handleTaskAdded} onTaskUpdated={handleTaskUpdated} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
}

export default App;

