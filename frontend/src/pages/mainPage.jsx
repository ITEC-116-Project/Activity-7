import '../style/mainPage.css';
import '../style/header.css';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import UserListModal from '../components/UserListModal';
import ProjectFormModal from '../components/ProjectFormModal';
import TaskFormModal from '../components/TaskFormModal';
import UserFormModal from '../components/UserFormModal';
import Header from '../components/header';
import Sidenav from '../components/Sidenav';
import Signup from './Signup';
import Login from './Login';
import CustomSelect from '../components/CustomSelect';

import React, { useState } from 'react';
import useMainPage from '../hooks/useMainPage';
import ConfirmModal from '../components/ConfirmModal';

function MainPage() {
  const {
    mode,
    setMode,
    user,
  logout,
    setUser,
    projects,
    tasks,
    users,
    modalOpen,
    modalType,
    modalMode,
    tasksFilterDept,
    tasksFilterProject,
    tasksFilterStatus,
    modalData,
    modalDept,
    dashboardView,
    setDashboardView,
    toasts,
    modalSubmitting,
    plannedCount,
    activeCount,
    completedCount,
  projectsFilterStatus,
  pendingCount,
  inProgressCount,
  completedTaskCount,
    addToast,
    removeToast,
    refreshAll,
    signup,
    login,
    createProjectData,
    deleteProject,
    updateProjectData,
    createTaskData,
    deleteTask,
    updateTaskData,
    createUserData,
    deleteUser,
    updateUser,
  updateProfile,
  openCreateModal,
  openEditModal,
  openUserListModal,
  openViewModal,
    closeModal,
    handleModalSubmit,
    setModalOpen,
    setModalType,
    setModalMode,
    setModalData,
    setModalDept,
    setTasksFilterDept,
    setTasksFilterProject,
    setTasksFilterStatus,
    setProjectsFilterStatus,
  } = useMainPage();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmProps, setConfirmProps] = useState({ title: '', message: '', onConfirm: null, confirmLabel: 'Delete' });

  function openConfirm({ title, message, onConfirm, confirmLabel = 'Delete' }) {
    setConfirmProps({ title, message, onConfirm, confirmLabel });
    setConfirmOpen(true);
  }

  // wrappers to keep the page-level forms compatible with existing form onSubmit events
  async function handleSignup(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const body = {
      name: form.get('name'),
      username: form.get('username'),
      companyId: form.get('companyId'),
      department: form.get('department') || undefined,
      email: form.get('email'),
      password: form.get('password'),
    };
    const confirm = form.get('confirmPassword');
    if ((body.password || '') !== (confirm || '')) { addToast('Passwords do not match', 'warning'); return; }
    if (!body.email) { addToast('Email is required', 'warning'); return; }
    const cid = String(body.companyId || '');
    const year = new Date().getFullYear().toString();
    if (cid === year) { addToast(`Invalid ID. Year-only IDs like "${year}" are not allowed. Use the full company ID (e.g. ${year}1).`, 'error'); return; }
    if (!(cid.startsWith('0') || (cid.startsWith(year) && cid.length > year.length))) { addToast('Invalid ID. Please use a valid company ID.', 'error'); return; }
    const pwd = body.password || '';
    const pwdStrong = pwd.length >= 8 && /[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd);
    if (!pwdStrong) { addToast('Password must be at least 8 characters and include uppercase, lowercase, number and special character', 'warning'); return; }
    await signup(body);
  }

  async function handleLogin(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const body = { username: form.get('username'), password: form.get('password') };
    await login(body);
  }

  const formatDateTime = (value) => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className={`main-container ${mode === 'signup' || mode === 'login' ? 'landing' : ''}`}>
      {/* hide the header on the landing auth pages */}
      {mode !== 'signup' && mode !== 'login' && (
        <Header
          user={user}
          onProfile={() => { setMode('dashboard'); openEditModal('user', user); }}
          onLogout={() => { logout(); }}
        />
      )}

      {/* Welcome CTA removed - signup and login use centered card layout below */}

      {mode === 'signup' && (
        <Signup onSubmit={handleSignup} switchToLogin={() => setMode('login')} />
      )}

      {mode === 'login' && (
        <Login onSubmit={handleLogin} switchToSignup={() => setMode('signup')} />
      )}

      {mode === 'dashboard' && (
        <div className="dashboard">
          <div className="dashboard-layout">
            <Sidenav dashboardView={dashboardView} setDashboardView={setDashboardView} />

            <div className="dashboard-main">
              <div className="dashboard-card">
                <div className="user-info">Welcome, {user?.name || user?.email}</div>
                {/* role/department shown in header badge (now in header) */}

                {dashboardView === 'projects' && (
                  <>

                    {/* project status cards */}
                    <div className="stats-row">
                      <div className="stat-card">
                        <div className="stat-icon" aria-hidden>
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M7 4h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                        </div>
                        <div className="stat-content">
                          <div className="stat-label">Planned Projects</div>
                          <div className="stat-value">{plannedCount}</div>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon" aria-hidden>
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M12 5v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                        </div>
                        <div className="stat-content">
                          <div className="stat-label">Active Projects</div>
                          <div className="stat-value">{activeCount}</div>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon" aria-hidden>
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <div className="stat-content">
                          <div className="stat-label">Completed Projects</div>
                          <div className="stat-value">{completedCount}</div>
                        </div>
                      </div>
                    </div>
                    <div className="section-actions">
                      {user?.role === 'manager' ? (
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <button className="main-button" onClick={() => openCreateModal('project')}>
                              <svg className="btn-icon" viewBox="5 0 24 18" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                              <span> New Project</span>
                            </button>
                            <CustomSelect
                              options={[{ value: '', label: 'All Status' }, { value: 'planned', label: 'Planned' }, { value: 'active', label: 'Active' }, { value: 'completed', label: 'Completed' }]}
                              value={projectsFilterStatus}
                              onChange={(v) => setProjectsFilterStatus(v)}
                            />
                          </div>
                          <button className="main-button" onClick={openUserListModal}>
                            <svg className="btn-icon" viewBox="5 0 24 18" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M5.5 19a6.5 6.5 0 0 1 13 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <span> View Members</span>
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <ul className="projects-grid">

                      {(() => {
                        const statusLabelMap = { planned: 'Planned', active: 'Active', completed: 'Completed' };
                        const displayed = projectsFilterStatus ? projects.filter((p) => p.status === projectsFilterStatus) : projects;
                        if (projectsFilterStatus && displayed.length === 0) {
                          const label = statusLabelMap[projectsFilterStatus] || projectsFilterStatus;
                          return (
                            <li className="empty-state">
                              {`No ${label.toLowerCase()} projects have been created yet.`}
                            </li>
                          );
                        }
                        if (!projectsFilterStatus && displayed.length === 0) {
                          return (
                            <li className="empty-state">
                              {"No projects have been created yet."}
                            </li>
                          );
                        }
                        return displayed.map((p) => (
                          <li key={p.id} className="item-row">
                          <div className="project-badge">{p.status}</div>
                          <div className="item-main">
                            <div className="project-title">{p.name}</div>
                            {p.description && <div className="project-desc">{p.description}</div>}
                            {p.owner && (
                              <div className="project-owner">Created by: {p.owner.name || p.owner.email}</div>
                            )}
                            <div className="project-meta">
                              {p.startDate || p.endDate ? (
                                <>
                                  {p.startDate && <div className="project-start">Start {new Date(p.startDate).toLocaleString()}</div>}
                                  {p.endDate && <div className="project-end">End {new Date(p.endDate).toLocaleString()}</div>}
                                </>
                              ) : 'No dates set'}
                            </div>
                          </div>
                          {user?.role === 'manager' && (
                            <div className="item-actions">
                              <button className="icon-action" title="Edit project" aria-label="Edit project" onClick={() => openEditModal('project', p)}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21v-3.75L14.06 6.19l3.75 3.75L6.75 21H3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.06 6.19l3.75 3.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </button>
                              <button className="icon-action" title="Delete project" aria-label="Delete project" onClick={() => openConfirm({ title: 'Delete project', message: `Are you sure you want to delete the project "${p.name || ''}" and all its related data? This cannot be undone.`, onConfirm: async () => { await deleteProject(p.id); }, confirmLabel: 'Delete project' })}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 11v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M14 11v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                              </button>
                            </div>
                          )}
                          </li>
                        ));
                      })()}
                    </ul>

                    {/* Create/edit handled via modal */}
                  </>
                )}
                {dashboardView === 'tasks' && (
                  <>
                    <div className="stats-row">
                      <div className="stat-card">
                        <div className="stat-icon" aria-hidden>
                          <svg viewBox="0 0 22 12" width="25" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 2h10v2l-3 3 3 3v2H7v-2l3-3L7 4V2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div className="stat-content">
                          <div className="stat-label">Pending</div>
                          <div className="stat-value">{pendingCount}</div>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon" aria-hidden>
                          <svg viewBox="0 0 24 24" width="25" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h6l3 6 6-12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div className="stat-content">
                          <div className="stat-label">In Progress</div>
                          <div className="stat-value">{inProgressCount}</div>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon" aria-hidden>
                          <svg viewBox="0 0 24 24" width="25" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <div className="stat-content">
                          <div className="stat-label">Completed</div>
                          <div className="stat-value">{completedTaskCount}</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {/* project list already rendered above */}
                {dashboardView === 'tasks' && (
                  <>
                    <div className="section-actions">
                      {user?.role === 'manager' ? (
                        <>
                          <button className="main-button" onClick={() => openCreateModal('task')}>
                            <svg className="btn-icon" viewBox="5 0 24 18" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                            <span> New Task</span>
                          </button>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <CustomSelect
                            options={[{ value: '', label: 'All projects' }, ...projects.map((p) => ({ value: p.id, label: p.name }))]}
                            value={tasksFilterProject}
                            onChange={(v) => setTasksFilterProject(v)}
                          />
                          <CustomSelect
                            options={[{ value: '', label: 'All status' }, { value: 'pending', label: 'Pending' }, { value: 'in_progress', label: 'In Progress' }, { value: 'done', label: 'Completed' }]}
                            value={tasksFilterStatus}
                            onChange={(v) => setTasksFilterStatus(v)}
                          />
                        </div>
                        </>
                      ) : (
                        <div className="muted">Members can view and update assigned tasks.</div>
                      )}
                    </div>
                    <ul className="projects-grid">
                      {(() => {
                        let displayed = user?.role === 'manager' ? tasks : tasks.filter((t) => t.assignedTo?.id === user?.id);
                        if (user?.role === 'manager') {
                          if (tasksFilterDept) displayed = displayed.filter((t) => t.assignedTo?.department === tasksFilterDept);
                          if (tasksFilterProject) displayed = displayed.filter((t) => String(t.project?.id) === String(tasksFilterProject));
                          if (tasksFilterStatus) displayed = displayed.filter((t) => t.status === tasksFilterStatus);
                        }
                        if (displayed.length === 0) {
                          const filtersActive = user?.role === 'manager' && (tasksFilterDept || tasksFilterProject || tasksFilterStatus);
                          return (
                            <li className="empty-state">
                              {filtersActive ? 'No tasks match the current filters.' : user?.role === 'manager' ? 'No tasks have been created yet.' : 'No tasks have been assigned to you yet.'}
                            </li>
                          );
                        }
                        return displayed.map((t) => (
                          <li key={t.id} className="item-row">
                            <div className="project-badge">{t.status}</div>
                            <div className="item-main">
                              <div className="project-title">{t.title}</div>
                              {t.description && <div className="project-desc">{t.description}</div>}
                              <div className="project-meta">
                                {(() => {
                                  const start = formatDateTime(t.project?.startDate);
                                  const end = formatDateTime(t.project?.endDate || t.deadline);
                                  const dateContent = (() => {
                                    if (start && end) return `${start} — ${end}`;
                                    if (end) return end;
                                    if (start) return start;
                                    return null;
                                  })();
                                  return (
                                    <div className="presentation-block">
                                      <div className="presentation-name"><span className="presentation-label">Project Title:</span>{' '}{t.project?.name || 'Presentation'}</div>
                                      <div className="presentation-datetime"><span className="presentation-label">Date:</span>{' '}{dateContent || 'Presentation date not set'}</div>
                                      {t.assignedTo && <div className="presentation-assigned"><span className="presentation-label">Assigned to:</span>{' '}{t.assignedTo.name || t.assignedTo.email}</div>}
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                            <div className="item-actions">
                              {user?.role === 'manager' ? (
                                <>
                                  <button className="icon-action" title="Edit task" aria-label="Edit task" onClick={() => openEditModal('task', t)}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21v-3.75L14.06 6.19l3.75 3.75L6.75 21H3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.06 6.19l3.75 3.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                  </button>
                                  <button className="icon-action" title="Delete task" aria-label="Delete task" onClick={() => openConfirm({ title: 'Delete task', message: `Are you sure you want to delete the task "${t.title || ''}"? This cannot be undone.`, onConfirm: async () => { await deleteTask(t.id); }, confirmLabel: 'Delete task' })}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 11v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M14 11v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button className="link" onClick={() => openViewModal('task', t)}>View</button>
                                  {t.status !== 'done' ? (
                                    <button className="link" onClick={async () => { await updateTaskData(t.id, { status: 'done' }); }}>Mark done</button>
                                  ) : (
                                    <div className="completed-text">Completed</div>
                                  )}
                                </>
                              )}
                            </div>
                          </li>
                        ));
                      })()}
                    </ul>

                    {/* modal handles create/edit for tasks */}
                  </>
                )}

                {/* Profile removed from dashboard view - opened via header profile icon as a modal */}

                {/* logout moved to header as an icon */}
              </div>{/* .dashboard-card */}
            </div>{/* .dashboard-main */}
          </div>{/* .dashboard-layout */}
        </div>
      )}
      {modalOpen && modalType === 'project' && (
        <ProjectFormModal modalMode={modalMode} modalData={modalData} onClose={closeModal} onSubmit={handleModalSubmit} />
      )}

      {modalOpen && modalType === 'task' && (
        <TaskFormModal
          modalMode={modalMode}
          modalData={modalData}
          projects={projects}
          users={users}
          currentUser={user}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
        />
      )}
      <UserListModal open={modalOpen && modalType === 'userList'} onClose={closeModal} users={users} currentUser={user} />
  <ConfirmModal open={confirmOpen} title={confirmProps.title} message={confirmProps.message} confirmLabel={confirmProps.confirmLabel} onClose={() => setConfirmOpen(false)} onConfirm={async () => { if (confirmProps.onConfirm) await confirmProps.onConfirm(); setConfirmOpen(false); }} />
      {modalOpen && modalType === 'user' && (
        <UserFormModal modalMode={modalMode} modalData={modalData} onClose={closeModal} onSubmit={async (values) => {
          // handle create vs profile update
          if (modalMode === 'create') {
            await handleModalSubmit(values);
            return;
          }
          // profile edit -> use updateProfile from hook
          await updateProfile(modalData.id, values);
          closeModal();
        }} />
      )}
      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default MainPage;
