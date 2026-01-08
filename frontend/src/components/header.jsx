export default function Header({ user, onProfile, onLogout }) {
  return (
    <header className="page-header">
      <div className="header-inner">
        <div className="logo" aria-hidden="true">
          <img src="/assets/clipboard.svg" alt="Task logo" className="site-logo" />
        </div>
        <div className="header-text">
          <h1 className="main-title">Task Management</h1>
          <p className="main-description">Projects and tasks with dates and status.</p>
        </div>
        {/* upper-right action icons (profile + logout) */}
        {user && (
          <div className="header-actions" role="toolbar" aria-label="User actions">
            <div className="user-badge" aria-label={user?.department ? `${user?.role === 'manager' ? 'Manager' : 'Member'} — ${user.department}` : (user?.role === 'manager' ? 'Manager' : 'Member')}>
              <span className="badge-role">{user?.role === 'manager' ? 'Manager' : 'Member'}</span>
              {user?.department && <span className="badge-dept">of {user.department} Department</span>}
            </div>
            <button
              className="icon-button"
              title="Profile"
              aria-label="Open profile"
              onClick={onProfile}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4 20c0-3.3 4-5 8-5s8 1.7 8 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <button
              className="icon-button"
              title="Log out"
              aria-label="Log out"
              onClick={onLogout}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
