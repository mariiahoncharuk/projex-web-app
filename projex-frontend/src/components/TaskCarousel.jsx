import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import axiosInstance from '../utils/axiosInstance';
import './TaskCarousel.css';

const TaskCarousel = () => {
  const [tasks, setTasks] = useState({
    "Waiting": [],
    "In Progress": [],
    "Done": []
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const columnNames = Object.keys(tasks);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/api/tasks');
      const fetchedTasks = response.data;

      const categorizedTasks = {
        "Waiting": [],
        "In Progress": [],
        "Done": []
      };

      // Categorize tasks by status
      fetchedTasks.forEach(task => {
        if (categorizedTasks[task.status]) {
          categorizedTasks[task.status].push(task);
        }
      });

      setTasks(categorizedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Move task to another status
  const moveTask = async (taskId, newStatus) => {
    try {
      await axiosInstance.put(`/api/tasks/${taskId}`, { status: newStatus });

      setTasks(prevTasks => {
        const updatedTasks = { ...prevTasks };

        // Find and move the task to the new status
        for (const status in updatedTasks) {
          updatedTasks[status] = updatedTasks[status].filter(task => task._id !== taskId);
        }

        const movedTask = Object.values(tasks).flat().find(task => task._id === taskId);
        if (movedTask) {
          movedTask.status = newStatus;
          updatedTasks[newStatus].push(movedTask);
        }

        return updatedTasks;
      });
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  // Navigation between columns
  const handleNext = () => setCurrentIndex((currentIndex + 1) % columnNames.length);
  const handlePrev = () => setCurrentIndex((currentIndex - 1 + columnNames.length) % columnNames.length);

  const currentColumn = columnNames[currentIndex];
  const currentTasks = tasks[currentColumn];

  return (
    <div className="task-container">
      <div className="task-header">
        <button onClick={handlePrev}>&lt;</button>
        <h3>{currentColumn}</h3>
        <button onClick={handleNext}>&gt;</button>
      </div>
      <div className="task-list">
        {(currentTasks || []).map((task) => (
          <TaskCard key={task._id} {...task} moveTask={moveTask} />
        ))}
      </div>
    </div>
  );
};

export default TaskCarousel;
