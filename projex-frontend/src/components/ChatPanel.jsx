import React from 'react';
import './ChatPanel.css';

const ChatPanel = () => {
  return (
    <div className="chat-container">
      <h3>Team Chat</h3>
      <div className="chat-box">
        <p><strong>Alice:</strong> Hey, did you finish the login page?</p>
        <p><strong>You:</strong> Yep! Just polishing the dashboard now.</p>
      </div>
      <input className="chat-input" placeholder="Type a message..." />
    </div>
  );
};

export default ChatPanel;
