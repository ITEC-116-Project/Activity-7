import React from 'react';
import '../style/sidenav.css';

export default function Sidenav({ dashboardView, setDashboardView }) {
  return (
    <nav className="sidenav" aria-label="Main navigation">
      <button
        className={`side-button ${dashboardView === 'projects' ? 'active' : ''}`}
        onClick={() => setDashboardView('projects')}
        aria-pressed={dashboardView === 'projects'}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M7 4h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        <span>Projects</span>
      </button>

      <button
        className={`side-button ${dashboardView === 'tasks' ? 'active' : ''}`}
        onClick={() => setDashboardView('tasks')}
        aria-pressed={dashboardView === 'tasks'}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M12 5v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
        <span>Tasks</span>
      </button>
    </nav>
  );
}
