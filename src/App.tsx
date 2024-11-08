import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Quote from './Quote';
import './App.css';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  important: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Example Task 1', completed: false, important: false },
    { id: 2, title: 'Completed Task', completed: true, important: false },
  ]);
  const [taskTitle, setTaskTitle] = useState('');
  const [view, setView] = useState('all');

  const handleAddTask = () => {
    if (taskTitle) {
      setTasks([...tasks, { id: tasks.length + 1, title: taskTitle, completed: false, important: false }]);
      setTaskTitle('');
    }
  };

  const toggleImportant = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, important: !task.important } : task
    ));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const displayedTasks = view === 'important' ? tasks.filter(task => task.important) : tasks;

  return (
    <Router>
      <div className="app">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>To Do</h2>
          <nav className="menu">
            <button onClick={() => setView('all')} className={`menu-item ${view === 'all' ? 'active' : ''}`}>
              My Day
            </button>
            <button onClick={() => setView('important')} className={`menu-item ${view === 'important' ? 'active' : ''}`}>
              Important
            </button>
          </nav>
          <button className="new-list-btn">+ New List</button>
        </aside>

        {/* Main Content */}
        <div className="main-content">
          {/* Top Bar */}
          <header className="top-bar">
            <h1>{view === 'important' ? 'Important Tasks' : 'My Day'}</h1>
            <p>Thursday, November 7</p>
            <div className="view-options">
              <button className="view-btn">Grid</button>
              <button className="view-btn">List</button>
              <button className="sort-btn">Sort</button>
              <button className="group-btn">Group</button>
            </div>
          </header>

          {/* Quote Component */}
          <Quote />

          {/* Task Input and List */}
          <div className="task-section">
            <div className="task-input">
              <input
                type="text"
                placeholder="Add a task"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                id="task-input-field"
              />
              <button className="add-task-btn" onClick={handleAddTask}>Add</button>
            </div>

            <div className="task-list">
              {displayedTasks.map((task) => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={task.completed}
                    onChange={() => {
                      setTasks(tasks.map(t =>
                        t.id === task.id ? { ...t, completed: !t.completed } : t
                      ));
                    }}
                  />
                  <span className="task-title">{task.title}</span>
                  <button
                    className={`important-btn ${task.important ? 'marked' : ''}`}
                    onClick={() => toggleImportant(task.id)}
                  >
                    {task.important ? 'Unmark Important' : 'Mark Important'}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
