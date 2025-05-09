// src/pages/WorkerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import ChatPanel from '../components/ChatPanel';
import './WorkerDashboard.css';
import axiosInstance from '../utils/axiosInstance';

const WorkerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState({
    "To Do": [],
    "In Progress": [],
    "Done": []
  });
  const [currentSection, setCurrentSection] = useState('To Do');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'worker') {
      navigate('/');
    }

    fetchTasks();
  }, [navigate]);

  // ✅ Fetch Tasks for Worker
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/api/tasks/worker-tasks');
      const workerTasks = response.data;

      setTasks({
        "To Do": workerTasks.filter(task => task.status === "To Do"),
        "In Progress": workerTasks.filter(task => task.status === "In Progress"),
        "Done": workerTasks.filter(task => task.status === "Done")
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // ✅ Update Task Status Directly in State
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };

      Object.keys(updatedTasks).forEach(status => {
        updatedTasks[status] = updatedTasks[status].filter(task => task._id !== taskId);
      });

      const task = Object.values(prevTasks).flat().find(task => task._id === taskId);
      if (task) {
        task.status = newStatus;
        updatedTasks[newStatus].push(task);
      }

      return updatedTasks;
    });

    // ✅ Send Update to Backend
    axiosInstance.put(`/api/tasks/${taskId}`, { status: newStatus })
      .catch(error => {
        console.error("Error updating task status:", error);
      });
  };

  // ✅ Update Task Timer Locally and Save
  const updateTaskTime = (taskId, newTime) => {
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      
      Object.keys(updatedTasks).forEach(status => {
        updatedTasks[status] = updatedTasks[status].map(task =>
          task._id === taskId ? { ...task, initialSeconds: newTime } : task
        );
      });

      return updatedTasks;
    });

    // ✅ Send Time Update to Backend
    axiosInstance.put(`/api/tasks/${taskId}`, { initialSeconds: newTime })
      .catch(error => {
        console.error("Error updating task time:", error);
      });
  };

  // ✅ Delete Task Instantly
  const deleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axiosInstance.delete(`/api/tasks/${taskId}`);
        setTasks(prevTasks => {
          const updatedTasks = { ...prevTasks };
          Object.keys(updatedTasks).forEach(status => {
            updatedTasks[status] = updatedTasks[status].filter(task => task._id !== taskId);
          });
          return updatedTasks;
        });
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  // ✅ Navigate between task sections
  const nextSection = () => {
    const sections = ["To Do", "In Progress", "Done"];
    const currentIndex = sections.indexOf(currentSection);
    setCurrentSection(sections[(currentIndex + 1) % sections.length]);
  };

  const prevSection = () => {
    const sections = ["To Do", "In Progress", "Done"];
    const currentIndex = sections.indexOf(currentSection);
    setCurrentSection(sections[(currentIndex - 1 + sections.length) % sections.length]);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
        <h2>Worker Dashboard</h2>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="content-container">
        <div className="tasks-section">
          <div className="task-navigation">
            <button className="carousel-left" onClick={prevSection}>&lt;</button>
            <h3>{currentSection}</h3>
            <button className="carousel-right" onClick={nextSection}>&gt;</button>
          </div>

          <div className="task-list">
            {tasks[currentSection]?.length > 0 ? (
              tasks[currentSection].map((task) => (
                <TaskCard 
                  key={task._id} 
                  {...task} 
                  updateTaskStatus={updateTaskStatus} 
                  updateTaskTime={updateTaskTime} 
                  deleteTask={deleteTask}
                />
              ))
            ) : (
              <p>No tasks in this section.</p>
            )}
          </div>
        </div>

        <div className="chat-section">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
