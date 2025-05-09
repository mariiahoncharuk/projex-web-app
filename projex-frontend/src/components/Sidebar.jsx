// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose, onSelect }) => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  // ✅ Fetch Projects Based on User Role
  const fetchProjects = async () => {
    try {
      const role = localStorage.getItem('role');
      let response;

      if (role === 'director') {
        response = await axiosInstance.get('/projects'); // Directors see all projects
      } else {
        response = await axiosInstance.get('/projects/my-projects'); // Managers and Workers see assigned projects
      }

      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects for sidebar:", error);
    }
  };

  // ✅ Handle Project Selection
  const handleProjectSelect = (project) => {
    if (onSelect) {
      onSelect(project);
    }
    navigate(`/projects/${project._id}`); // Navigate to project page
    onClose();
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/'); // Redirect to login page
  };

  return (
    <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className={`sidebar ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="sidebar-content">
          <h3>Your Projects</h3>
          <div className="project-links">
            {projects.length > 0 ? (
              projects.map((project) => (
                <p 
                  key={project._id} 
                  onClick={() => handleProjectSelect(project)}
                >
                  {project.name}
                </p>
              ))
            ) : (
              <p>No projects available.</p>
            )}
          </div>
          
          <div className="sidebar-footer">
            <button className="settings-btn">Settings</button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
