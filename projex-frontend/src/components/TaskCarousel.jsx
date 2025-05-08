import React, { useState } from 'react';
import TaskCard from './TaskCard';
import './TaskCarousel.css';

const columns = {
  "Waiting": [
    {
      name: "Design login page",
      description: "Make it responsive and pretty",
      person: { name: "Anna", avatar: "https://i.pravatar.cc/24?img=1" },
      initialSeconds: 130
    },
    {
      name: "Write user stories",
      description: "Clear definitions for all features.",
      person: { name: "John", avatar: "https://i.pravatar.cc/24?img=5" },
      initialSeconds: 300
    }
  ],
  "In Progress": [
    {
      name: "Connect backend",
      description: "Integrate with API endpoints",
      person: { name: "Mike", avatar: "https://i.pravatar.cc/24?img=2" },
      initialSeconds: 900
    }
  ],
  "Done": [
    {
      name: "Create project structure",
      description: "Initial setup completed",
      person: { name: "Sasha", avatar: "https://i.pravatar.cc/24?img=3" },
      initialSeconds: 3600
    }
  ]
};

const TaskCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const columnNames = Object.keys(columns);

  const handleNext = () => setCurrentIndex((currentIndex + 1) % columnNames.length);
  const handlePrev = () => setCurrentIndex((currentIndex - 1 + columnNames.length) % columnNames.length);

  const currentColumn = columnNames[currentIndex];
  const currentTasks = columns[currentColumn];

  return (
    <div className="task-container">
      <div className="task-header">
        <button onClick={handlePrev}>&lt;</button>
        <h3>{currentColumn}</h3>
        <button onClick={handleNext}>&gt;</button>
      </div>
      <div className="task-list">
        {(currentTasks || []).map((task, index) => (
          <TaskCard key={index} {...task} />
        ))}
      </div>
    </div>
  );
};

export default TaskCarousel;
