import React from 'react';
import './TaskCard.css';

const TaskCard = ({ name = 'Untitled', description = '', person = {}, initialSeconds = 0 }) => {
  return (
    <div className="task-card">
      <div className="task-header">
        <h4 className="task-title">{name}</h4>
        <div className="task-avatar">
          <img src={person.avatar} alt={person.name || "User"} />
        </div>
      </div>
      <p className="task-description">{description || "No description provided."}</p>
      <div className="task-footer">
        <span className="task-time">⏱️ {initialSeconds}s</span>
        <span className="task-person">{person.name || "Unassigned"}</span>
      </div>
    </div>
  );
};

export default TaskCard;
