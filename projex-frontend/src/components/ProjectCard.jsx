import React, { useState, useEffect } from 'react';
import './ProjectCard.css';
import axiosInstance from '../utils/axiosInstance';

const ProjectCard = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [managers, setManagers] = useState([]);
  const [assignedManager, setAssignedManager] = useState('');

  useEffect(() => {
    fetchManagers();
  }, []);

  // ✅ Fetch Managers for Assignment
  const fetchManagers = async () => {
    try {
      const response = await axiosInstance.get('/api/users?role=manager');
      setManagers(response.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  // ✅ Handle Project Creation
  const createProject = async () => {
    if (!name.trim()) {
      alert("Project name cannot be empty.");
      return;
    }

    try {
      const response = await axiosInstance.post('/api/projects', {
        name,
        description,
        assignedUsers: assignedManager ? [assignedManager] : [] // Assign manager
      });

      onCreate(response.data);
      resetForm();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // ✅ Reset Form after Creation
  const resetForm = () => {
    setName('');
    setDescription('');
    setAssignedManager('');
  };

  return (
    <div className="project-card-overlay">
      <div className="project-card">
        <h3>Create New Project</h3>
        <input 
          type="text" 
          placeholder="Project Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <textarea 
          placeholder="Project Description (Optional)" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <label htmlFor="manager-select">Assign a Manager (Optional)</label>
        <select 
          id="manager-select"
          value={assignedManager} 
          onChange={(e) => setAssignedManager(e.target.value)}
        >
          <option value="">-- Select a Manager --</option>
          {managers.length > 0 ? (
            managers.map((manager) => (
              <option key={manager._id} value={manager._id}>
                {manager.name} ({manager.email})
              </option>
            ))
          ) : (
            <option value="" disabled>No managers available</option>
          )}
        </select>

        <div className="project-card-actions">
          <button className="create-btn" onClick={createProject}>Create</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
