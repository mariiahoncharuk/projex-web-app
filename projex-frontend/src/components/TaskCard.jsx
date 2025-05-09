// src/components/TaskCard.jsx
import React, { useState, useEffect } from 'react';
import './TaskCard.css';
import axiosInstance from '../utils/axiosInstance';

const TaskCard = ({ _id, name, description, assignedWorker, initialSeconds, status: initialStatus, updateTaskStatus, updateTaskTime, deleteTask }) => {
  const [seconds, setSeconds] = useState(initialSeconds || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Timer functionality (runs every second if started)
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } 
    return () => clearInterval(interval);
  }, [isRunning]);

  // ✅ Save Task Time When Timer is Stopped
  useEffect(() => {
    if (!isRunning && !isSaving) {
      saveTaskTime();
    }
  }, [isRunning]);

  // ✅ Save task time to the database immediately when stopped
  const saveTaskTime = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      console.log(`✅ [TASK ${_id}] Saving time: ${seconds} seconds`);
      await axiosInstance.put(`/api/tasks/${_id}`, { initialSeconds: seconds });
      updateTaskTime(_id, seconds); // ✅ Update Parent State
      console.log(`✅ [TASK ${_id}] Time saved successfully: ${seconds} seconds`);
    } catch (error) {
      console.error(`❌ [TASK ${_id}] Error saving task time:`, error);
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Handle status change
  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    updateTaskStatus(_id, newStatus);

    try {
      console.log(`✅ [TASK ${_id}] Changing status to ${newStatus}`);
      await axiosInstance.put(`/api/tasks/${_id}`, { status: newStatus });
      console.log(`✅ [TASK ${_id}] Status updated to ${newStatus}`);
    } catch (error) {
      console.error(`❌ [TASK ${_id}] Error updating status:`, error);
    }
  };

  // ✅ Toggle timer start/stop
  const toggleTimer = () => {
    setIsRunning((prev) => {
      const newState = !prev;
      console.log(`✅ [TASK ${_id}] Timer ${newState ? 'Started' : 'Stopped'}`);
      
      if (!newState) {
        saveTaskTime(); // Save time immediately when stopping
      }

      return newState;
    });
  };

  // ✅ Display Time (HH:MM:SS)
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  // ✅ Delete Task
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axiosInstance.delete(`/api/tasks/${_id}`);
        deleteTask(_id);
        console.log(`✅ [TASK ${_id}] Deleted successfully`);
      } catch (error) {
        console.error(`❌ [TASK ${_id}] Error deleting task:`, error);
      }
    }
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h4>{name}</h4>
        <button className="delete-btn" onClick={handleDelete}>❌</button>
      </div>

      <p>{description || "No description provided."}</p>
      <p>Assigned to: {assignedWorker ? assignedWorker.name : "Unassigned"}</p>

      <div className="task-footer">
        <span className="task-time">⏱️ {formatTime(seconds)}</span>
        <button onClick={toggleTimer} className={`timer-btn ${isRunning ? 'running' : ''}`}>
          {isRunning ? 'Stop' : 'Start'}
        </button>

        <select 
          value={status} 
          onChange={(e) => handleStatusChange(e.target.value)} 
          className="task-status"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard;
