import React from 'react';

export default function Modal({ title, children, onClose, icon = null }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {icon && <span className="modal-icon" aria-hidden>{icon}</span>}
            <h3>{title}</h3>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
