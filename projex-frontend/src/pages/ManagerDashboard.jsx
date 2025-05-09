// src/pages/ManagerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import './ManagerDashboard.css';
import axiosInstance from '../utils/axiosInstance';

const ManagerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', description: '', assignedWorker: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'manager') {
      navigate('/');
    }

    fetchWorkers();
    fetchTasks();
  }, [navigate]);

  // ✅ Fetch All Workers
  const fetchWorkers = async () => {
    try {
      const response = await axiosInstance.get('/api/tasks/workers');
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  // ✅ Fetch All Tasks
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // ✅ Handle Creating a New Task
  const handleCreateTask = async () => {
    if (!newTask.name) {
      alert("Task name is required.");
      return;
    }

    if (!newTask.assignedWorker) {
      alert("You must select a worker.");
      return;
    }

    try {
      const response = await axiosInstance.post('/api/tasks', {
        name: newTask.name,
        description: newTask.description,
        assignedWorker: newTask.assignedWorker
      });

      setTasks(prevTasks => [...prevTasks, response.data]);
      setNewTask({ name: '', description: '', assignedWorker: '' });
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // ✅ Update Task Status Directly in State
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );

    axiosInstance.put(`/api/tasks/${taskId}`, { status: newStatus })
      .catch(error => {
        console.error("Error updating task status:", error);
        fetchTasks(); // Refetch if error
      });
  };

  // ✅ Delete a Task
  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
        <h2>Manager Dashboard</h2>
        <button className="logout-btn" onClick={() => navigate('/')}>Logout</button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="content-container">
        <div className="tasks-section">
          <div className="task-header">
            <h3>Your Tasks</h3>
            <button onClick={() => setShowTaskForm(!showTaskForm)}>+ Create Task</button>
          </div>

          {showTaskForm && (
            <div className="task-form centered">
              <input 
                type="text" 
                placeholder="Task Name" 
                value={newTask.name} 
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} 
              />
              <textarea 
                placeholder="Description" 
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}></textarea>

              <select 
                value={newTask.assignedWorker} 
                onChange={(e) => setNewTask({ ...newTask, assignedWorker: e.target.value })}
              >
                <option value="">Select Worker</option>
                {workers.map(worker => (
                  <option key={worker._id} value={worker._id}>{worker.name}</option>
                ))}
              </select>

              <button onClick={handleCreateTask}>Save Task</button>
            </div>
          )}

          <div className="task-list">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard 
                  key={task._id} 
                  {...task} 
                  updateTaskStatus={updateTaskStatus} 
                  deleteTask={deleteTask}
                />
              ))
            ) : (
              <p>No tasks available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
