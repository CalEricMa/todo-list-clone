import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Quote from './Quote';
import './App.css';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  important: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [view, setView] = useState('all');

  const API_BASE_URL = "/api";

  // Load tasks from the backend on component mount
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }
    fetchTasks();
  }, []);

  // Add a new task
  const handleAddTask = async () => {
    if (taskTitle) {
      const newTask = { title: taskTitle, description: "", status: "incomplete", important: false };
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask),
        });
        const data = await response.json();
        setTasks([...tasks, { ...newTask, id: data.id }]);
        setTaskTitle('');
      } catch (error) {
        console.error("Failed to add task:", error);
      }
    }
  };

  // Toggle important status
  const toggleImportant = async (id: number) => {
    const task = tasks.find(task => task.id === id);
    if (task) {
      const updatedTask = { ...task, important: !task.important };
      try {
        await fetch(`${API_BASE_URL}/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTask),
        });
        setTasks(tasks.map(t => (t.id === id ? updatedTask : t)));
      } catch (error) {
        console.error("Failed to update task importance:", error);
      }
    }
  };

  // Toggle task completion status
  const toggleCompletion = async (id: number) => {
    const task = tasks.find(task => task.id === id);
    if (task) {
      const updatedTask = { ...task, status: task.status === 'completed' ? 'incomplete' : 'completed' };
      try {
        await fetch(`${API_BASE_URL}/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTask),
        });
        setTasks(tasks.map(t => (t.id === id ? updatedTask : t)));
      } catch (error) {
        console.error("Failed to update task status:", error);
      }
    }
  };

  // Delete a task
  const handleDeleteTask = async (id: number) => {
    try {
      await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const displayedTasks = view === 'important' ? tasks.filter(task => task.important) : tasks;

  return (
    <Router>
      <div className="app">
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

        <div className="main-content">
          <header className="top-bar">
            <h1>{view === 'important' ? 'Important Tasks' : 'My Day'}</h1>
            <div className="view-options">
              {/* <button className="view-btn">Grid</button>
              <button className="view-btn">List</button>
              <button className="sort-btn">Sort</button>
              <button className="group-btn">Group</button> */}
            </div>
          </header>

          <Quote />

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
                <div key={task.id} className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => toggleCompletion(task.id)}
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
