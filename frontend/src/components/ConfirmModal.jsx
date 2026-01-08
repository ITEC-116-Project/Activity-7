import React from 'react';
import Modal from './Modal';

export default function ConfirmModal({ open = false, title = 'Confirm', message = '', onClose = () => {}, onConfirm = () => {}, confirmLabel = 'Delete', cancelLabel = 'Cancel' }) {
  if (!open) return null;
  const icon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 14h-2v-2h2v2zm0-4h-2V6h2v6z" stroke="currentColor" strokeWidth="0.8"/></svg>
  );
  return (
    <Modal title={title} icon={icon} onClose={onClose}>
      <div className="confirm-message">{message}</div>
      <div className="confirm-actions">
        <button className="link-cancel" onClick={onClose}>{cancelLabel}</button>
        <button className="main-button confirm-button" onClick={async () => { await onConfirm(); onClose(); }}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}
