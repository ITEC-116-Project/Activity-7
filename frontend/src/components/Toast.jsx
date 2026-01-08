import React from 'react';

export default function Toast({ toasts = [], onClose }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type || 'info'}`}>
          <div className="toast-message">{t.message}</div>
          <button className="toast-close" onClick={() => onClose(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
