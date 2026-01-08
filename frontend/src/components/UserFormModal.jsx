import React, { useState } from 'react';
import Modal from './Modal';

export default function UserFormModal({ modalMode = 'create', modalData = null, onClose = () => {}, onSubmit = async () => {} }) {
  const [submitting, setSubmitting] = useState(false);
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const profileIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );

  return (
  <Modal title={modalMode === 'create' ? 'Create User' : 'Edit Profile'} onClose={onClose} icon={modalMode === 'create' ? null : profileIcon}>
      <form onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
          const f = new FormData(e.target);
          if (modalMode === 'create') {
              const body = { name: f.get('name'), email: f.get('email'), password: f.get('password') || undefined };
              await onSubmit(body);
              return;
            }

            const body = { name: f.get('name'), email: f.get('email') };
            const newPwd = String(f.get('newPassword') || '');
            const oldPwd = String(f.get('oldPassword') || '');
            if (newPwd) {
              // client-side password strength check
              const pwdStrong = newPwd.length >= 8 && /[a-z]/.test(newPwd) && /[A-Z]/.test(newPwd) && /\d/.test(newPwd) && /[^A-Za-z0-9]/.test(newPwd);
              if (!pwdStrong) { alert('New password must be at least 8 characters and include uppercase, lowercase, number and special character'); return; }
              if (!oldPwd) { alert('Old password is required to change password'); return; }
              body.newPassword = newPwd;
              body.oldPassword = oldPwd;
            }
            await onSubmit(body);
        } finally { setSubmitting(false); }
      }}>
          {modalMode === 'create' ? (
            <>
              <input name="name" defaultValue={modalData?.name || ''} placeholder="Name" required />
              <input name="email" type="email" defaultValue={modalData?.email || ''} placeholder="Email" required />
              <input name="password" type="password" placeholder="Password" required />
            </>
          ) : (
            <>
              <div className="profile-field">
                <label>Full name</label>
                <div className="profile-value">{modalData?.name}</div>
              </div>
              <div className="profile-field">
                <label>ID</label>
                <div className="profile-value">{modalData?.companyId || modalData?.username || ''}</div>
              </div>
              <div className="profile-field">
                <label htmlFor="profile-email">Email</label>
                <input id="profile-email" name="email" type="email" defaultValue={modalData?.email || ''} placeholder="Email" required />
              </div>
              <div className="profile-field">
                <label htmlFor="profile-old-password">Old Password</label>
                <div className="input-wrapper">
                  <input id="profile-old-password" name="oldPassword" type={showOldPwd ? 'text' : 'password'} placeholder="Old password" />
                  <button type="button" className="eye-toggle" onClick={() => setShowOldPwd((s) => !s)} aria-label="Toggle old password visibility">{showOldPwd ? (
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                )}</button>
                </div>
              </div>
              <div className="profile-field">
                <label htmlFor="profile-new-password">New Password</label>
                <div className="input-wrapper">
                  <input id="profile-new-password" name="newPassword" type={showNewPwd ? 'text' : 'password'} placeholder="New password (leave empty to keep current)" />
                  <button type="button" className="eye-toggle" onClick={() => setShowNewPwd((s) => !s)} aria-label="Toggle new password visibility">{showNewPwd ? (
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                )}</button>
                </div>
              </div>
            </>
          )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button type="button" className="link" onClick={onClose}>Cancel</button>
          <button className="main-button" type="submit" disabled={submitting}>{modalMode === 'create' ? (submitting ? 'Creating...' : 'Create') : (submitting ? 'Saving...' : 'Save')}</button>
        </div>
      </form>
    </Modal>
  );
}
