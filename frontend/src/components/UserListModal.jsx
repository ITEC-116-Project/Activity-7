import React from 'react';
import Modal from './Modal';
import useUserList from '../hooks/useUserList';

export default function UserListModal({ open = false, onClose = () => {}, users = [], currentUser = null }) {
  const visibleUsers = useUserList(users, currentUser);
  if (!open) return null;
  return (
    <Modal
      title={`Members of  ${currentUser?.department || 'your company'} Department`}
      onClose={onClose}
      icon={<span role="img" aria-label="users">👥</span>}
    >
      <div className="user-list-modal">
        {(() => {
          if (visibleUsers.length === 0) {
            return <div className="empty-state">No teammates found in this department.</div>;
          }
          return (
            <ul className="user-list">
              {visibleUsers.map((u) => (
                <li key={u.id} className="user-row">
                  <div className="user-avatar" aria-hidden>
                    {(u.name || u.email || '?').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{u.name || u.email}</div>
                    <div className="user-meta">
                      <span>{u.email}</span>
                      {u.role && <span className="dot" aria-hidden>•</span>}
                      {u.role && <span className="badge">{u.role}</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          );
        })()}
      </div>
    </Modal>
  );
}
