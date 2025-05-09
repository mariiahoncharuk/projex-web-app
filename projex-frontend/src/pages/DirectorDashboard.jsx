// src/pages/DirectorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import './DirectorDashboard.css';
import axiosInstance from '../utils/axiosInstance';

const DirectorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const navigate = useNavigate();

  // ✅ Protect this route (only directors can access)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'director') {
      navigate('/');
    } else {
      fetchProjects();
    }
  }, [navigate]);

  // ✅ Fetch All Projects for Director
  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // ✅ Create New Project Handler
  const handleCreateProject = async (newProject) => {
    setProjects([...projects, newProject]);
    setShowCreateCard(false);
  };

  // ✅ Delete Project
  const deleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axiosInstance.delete(`/api/projects/${projectId}`);
        setProjects(projects.filter((project) => project._id !== projectId));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
        <h2>Director Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="dashboard-content">
        <div className="director-section">
          <h3>Your Company Projects</h3>
          <div className="project-list">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project._id} className="project-card">
                  <h4>{project.name}</h4>
                  <p>{project.description || "No description provided."}</p>
                  <button className="delete-btn" onClick={() => deleteProject(project._id)}>❌ Delete</button>
                </div>
              ))
            ) : (
              <p>No projects yet.</p>
            )}
          </div>

          <div className="create-project-btn-container">
            <button className="create-project-btn" onClick={() => setShowCreateCard(true)}>+ Create Project</button>
          </div>
        </div>
      </div>

      {/* ✅ Project Creation Card (Popup) */}
      {showCreateCard && (
        <ProjectCard onClose={() => setShowCreateCard(false)} onCreate={handleCreateProject} />
      )}
    </div>
  );
};

export default DirectorDashboard;
