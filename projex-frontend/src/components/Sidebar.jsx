import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const projects = ['Projex App', 'Client Dashboard', 'Marketing Plan'];

  return (
    <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className={`sidebar ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="sidebar-content">
          <div className="project-links">
            {projects.map((project, index) => (
              <p key={index}>{project}</p>
            ))}
          </div>
          <div className="sidebar-footer">
            <button className="settings-btn">Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
