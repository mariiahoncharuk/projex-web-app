import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TaskCarousel from '../components/TaskCarousel';
import ChatPanel from '../components/ChatPanel';
import './WorkerDashboard.css';

const WorkerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
        Worker Dashboard
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-content">
        <div className="tasks-section">
          <TaskCarousel />
        </div>
        <div className="chat-section">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
