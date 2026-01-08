import { useState, useEffect, useRef } from 'react';

const API = 'http://localhost:3000';

export default function useMainPage() {
  const [mode, setMode] = useState('login');
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('act7_user');
      return raw ? JSON.parse(raw) : null;
    } catch (err) { return null; }
  });
  const verifyRetryRef = useRef(null);
  const verifyControllerRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [tasksFilterDept, setTasksFilterDept] = useState('');
  const [tasksFilterProject, setTasksFilterProject] = useState('');
  const [tasksFilterStatus, setTasksFilterStatus] = useState('');
  const [projectsFilterStatus, setProjectsFilterStatus] = useState('');
  const [modalData, setModalData] = useState(null);
  const [modalDept, setModalDept] = useState('');
  const [dashboardView, setDashboardView] = useState('projects');
  const [toasts, setToasts] = useState([]);
  const [modalSubmitting, setModalSubmitting] = useState(false);

  // derived stats
  const plannedCount = projects.filter((p) => p.status === 'planned').length;
  const activeCount = projects.filter((p) => p.status === 'active').length;
  const completedCount = projects.filter((p) => p.status === 'completed').length;
  // task-derived stats
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const completedTaskCount = tasks.filter((t) => t.status === 'done').length;

  useEffect(() => {
    if (mode === 'dashboard') {
      refreshAll();
      const id = setInterval(() => { refreshAll().catch(() => {}); }, 60 * 1000);
      return () => clearInterval(id);
    }
  }, [mode]);

  // If a user is present (from localStorage on load), enter dashboard and refresh data
  useEffect(() => {
    let cancelled = false;
    const currentUser = user;

    if (verifyRetryRef.current) {
      clearTimeout(verifyRetryRef.current);
      verifyRetryRef.current = null;
    }
    if (verifyControllerRef.current) {
      verifyControllerRef.current.abort();
      verifyControllerRef.current = null;
    }

    async function verify(targetUser) {
      if (!targetUser) { setMode('login'); return; }

      const controller = new AbortController();
      verifyControllerRef.current = controller;

      try {
        const res = await fetch(`${API}/auth/profile/${targetUser.id}`, { signal: controller.signal });
        if (cancelled || controller.signal.aborted) return;

        if (res.ok) {
          const info = await res.json();
          if (cancelled || controller.signal.aborted) return;
          setUser(info);
          try { localStorage.setItem('act7_user', JSON.stringify(info)); } catch (err) { /* ignore */ }
          setMode('dashboard');
          return;
        }

        if (res.status >= 500) {
          addToast('Server temporarily unavailable. Keeping you signed in and retrying.', 'warning');
          setMode('dashboard');
          verifyRetryRef.current = setTimeout(() => {
            verifyRetryRef.current = null;
            if (!cancelled) verify(targetUser);
          }, 3000);
          return;
        }

        setUser(null);
        try { localStorage.removeItem('act7_user'); } catch (e) { /* ignore */ }
        setMode('login');
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        addToast('Unable to reach server. Keeping you signed in and will retry automatically.', 'warning');
        setMode('dashboard');
        verifyRetryRef.current = setTimeout(() => {
          verifyRetryRef.current = null;
          if (!cancelled) verify(targetUser);
        }, 3000);
      }
    }

    verify(currentUser);

    return () => {
      cancelled = true;
      if (verifyRetryRef.current) {
        clearTimeout(verifyRetryRef.current);
        verifyRetryRef.current = null;
      }
      if (verifyControllerRef.current) {
        verifyControllerRef.current.abort();
        verifyControllerRef.current = null;
      }
    };
    // only run when the user identity changes
  }, [user?.id]);

  function filterProjectsByDepartment(list, currentUser) {
    if (!Array.isArray(list)) return [];
    if (!currentUser?.department) return list;
    return list.filter((project) => (project?.owner?.department || null) === currentUser.department);
  }

  function filterTasksByDepartment(list, currentUser) {
    if (!Array.isArray(list)) return [];
    if (!currentUser) return [];
    const department = currentUser.department;
    const isManager = currentUser.role === 'manager';

    return list.filter((task) => {
      const assignedToCurrentUser = task?.assignedTo?.id === currentUser.id;
      if (!department) {
        return isManager ? true : assignedToCurrentUser;
      }

      const projectDept = task?.project?.owner?.department || null;
      const assigneeDept = task?.assignedTo?.department || null;

      if (isManager) {
        if (projectDept === department) return true;
        if (assigneeDept === department) return true;
        if (!task?.project && !task?.assignedTo) return true;
        return false;
      }

      if (!assignedToCurrentUser) return false;
      if (!projectDept) return true;
      return projectDept === department;
    });
  }

  function filterUsersByDepartment(list, currentUser) {
    if (!Array.isArray(list)) return [];
    if (!currentUser?.department) return list;
    return list.filter((u) => (u?.department || null) === currentUser.department);
  }

  async function refreshAll() {
    try {
      const [pRes, tRes, uRes] = await Promise.all([
        fetch(`${API}/projects`),
        fetch(`${API}/tasks`),
        fetch(`${API}/user-crud`),
      ]);

      const [projectsData, tasksData, usersData] = await Promise.all([
        pRes.ok ? pRes.json() : Promise.resolve(null),
        tRes.ok ? tRes.json() : Promise.resolve(null),
        uRes.ok ? uRes.json() : Promise.resolve(null),
      ]);

      // If any projects have an endDate in the past and are not marked completed,
      // mark them completed on the server and reflect that locally so stats update.
      if (Array.isArray(projectsData)) {
        const now = new Date();
        const expired = projectsData.filter((p) => p?.endDate && new Date(p.endDate) < now && p.status !== 'completed');
        if (expired.length > 0) {
          try {
            await Promise.all(expired.map((p) => fetch(`${API}/projects/${p.id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: 'completed' }) }).catch(() => {})));
            // update local snapshot so UI reflects changes immediately
            expired.forEach((p) => { p.status = 'completed'; });
          } catch (err) { /* ignore failures - not critical */ }
        }
      }

      if (projectsData) setProjects(filterProjectsByDepartment(projectsData, user));
      if (tasksData) setTasks(filterTasksByDepartment(tasksData, user));
      if (usersData) setUsers(filterUsersByDepartment(usersData, user));
    } catch (err) { /* ignore */ }
  }

      

  function addToast(message, type = 'info', duration = 4000) {
    const id = Date.now() + Math.random();
    const t = { id, message, type };
    setToasts((s) => [...s, t]);
    if (duration > 0) setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), duration);
    return id;
  }

  function removeToast(id) { setToasts((s) => s.filter((x) => x.id !== id)); }

  async function signup(body) {
    try {
      const res = await fetch(`${API}/auth/signup`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { throw new Error(Array.isArray(data.message) ? data.message.join('\n') : data.message || data.error || 'signup failed'); }
  setUser(data);
  try { localStorage.setItem('act7_user', JSON.stringify(data)); } catch (err) { /* ignore */ }
      addToast('Account created and logged in', 'success');
      setMode('dashboard');
      await refreshAll();
      return { ok: true };
    } catch (err) { addToast(err.message || 'signup failed', 'error'); return { ok: false, error: err }; }
  }

  async function login(body) {
    try {
      const res = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { throw new Error(Array.isArray(data.message) ? data.message.join('\n') : data.message || data.error || 'login failed'); }
  setUser(data);
  try { localStorage.setItem('act7_user', JSON.stringify(data)); } catch (err) { /* ignore */ }
      setMode('dashboard');
      return { ok: true };
    } catch (err) { addToast(err.message || 'login failed', 'error'); return { ok: false, error: err }; }
  }

  // Projects
  async function createProjectData(body) {
    try {
      if (user && !body.creatorId) body.creatorId = user.id;
      const res = await fetch(`${API}/projects`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data?.message || data?.error || 'Create project failed'); }
      addToast('Project created', 'success');
      await refreshAll();
      return true;
    } catch (err) { addToast(err.message || 'Create project failed', 'error'); return false; }
  }

  async function deleteProject(id) {
    try {
      const res = await fetch(`${API}/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Delete failed');
      }
      addToast('Project deleted', 'success');
      await refreshAll();
    } catch (err) { addToast(err.message || 'Delete failed', 'error'); }
  }

  async function updateProjectData(id, data) {
    try {
      const res = await fetch(`${API}/projects/${id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Update failed');
      addToast('Project updated', 'success');
      await refreshAll();
      return true;
    } catch (err) { addToast(err.message || 'Update failed', 'error'); return false; }
  }

  // Tasks
  async function createTaskData(body) {
    try {
      if (user && !body.creatorId) body.creatorId = user.id;
      const res = await fetch(`${API}/tasks`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data?.message || data?.error || 'Create task failed'); }
      addToast('Task created', 'success');
      await refreshAll();
      return true;
    } catch (err) { addToast(err.message || 'Create task failed', 'error'); return false; }
  }

  async function deleteTask(id) {
    try {
      const res = await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Delete failed');
      }
      addToast('Task deleted', 'success');
      await refreshAll();
    } catch (err) { addToast(err.message || 'Delete failed', 'error'); }
  }

  async function updateTaskData(id, data) {
    try {
      const res = await fetch(`${API}/tasks/${id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Update failed');
      addToast('Task updated', 'success');
      await refreshAll();
      return true;
    } catch (err) { addToast(err.message || 'Update failed', 'error'); return false; }
  }

  // Users
  async function createUserData(body) {
    try {
      const res = await fetch(`${API}/user-crud`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data?.message || data?.error || 'Create user failed'); }
      addToast('User created', 'success');
      await refreshAll();
      return true;
    } catch (err) { addToast(err.message || 'Create user failed', 'error'); return false; }
  }

  async function deleteUser(id) {
    try {
      const res = await fetch(`${API}/user-crud/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      addToast('User deleted', 'success');
      await refreshAll();
    } catch (err) { addToast(err.message || 'Delete failed', 'error'); }
  }

  async function updateUser(id, data) {
    try {
      const res = await fetch(`${API}/user-crud/${id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Update failed');
      addToast('User updated', 'success');
      await refreshAll();
      return true;
    } catch (err) { addToast(err.message || 'Update failed', 'error'); return false; }
  }

  // update the currently authenticated user's profile
  async function updateProfile(id, data) {
    try {
      const res = await fetch(`${API}/auth/profile/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      const info = await res.json();
      if (!res.ok) throw new Error(info.message || 'Update failed');
  setUser(info);
  try { localStorage.setItem('act7_user', JSON.stringify(info)); } catch (err) { /* ignore */ }
      addToast('Profile updated', 'success');
      return true;
    } catch (err) { addToast(err.message || 'Update failed', 'error'); return false; }
  }

  function openCreateModal(type) {
    setModalType(type);
    setModalMode('create');
    setModalData(null);
    if (type === 'task') setModalDept('');
    setModalOpen(true);
  }

  function openViewModal(type, item) {
    setModalType(type);
    setModalMode('view');
    setModalData(item);
    if (type === 'task') setModalDept(item?.assignedTo?.department || '');
    setModalOpen(true);
  }

  function openUserListModal() {
    setModalType('userList');
    setModalMode('view');
    setModalData(null);
    setModalOpen(true);
  }

  function logout() {
    if (verifyRetryRef.current) {
      clearTimeout(verifyRetryRef.current);
      verifyRetryRef.current = null;
    }
    if (verifyControllerRef.current) {
      verifyControllerRef.current.abort();
      verifyControllerRef.current = null;
    }

    setModalOpen(false);
    setModalType(null);
    setModalMode('create');
    setModalData(null);
    setModalDept('');
    setProjects([]);
    setTasks([]);
    setUsers([]);
    setDashboardView('projects');
    setTasksFilterDept('');
    setTasksFilterProject('');
    setTasksFilterStatus('');
    setProjectsFilterStatus('');
    setToasts([]);
    setMode('login');
    setUser(null);
    try { localStorage.removeItem('act7_user'); } catch (err) { /* ignore */ }
  }

  function openEditModal(type, item) {
    setModalType(type);
    setModalMode('edit');
    setModalData(item);
    if (type === 'task') setModalDept(item?.assignedTo?.department || '');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setModalType(null);
    setModalMode('create');
    setModalData(null);
  }

  async function handleModalSubmit(values) {
    if (modalType === 'project') {
      if (modalMode === 'create') {
        const ok = await createProjectData(values);
        if (ok) closeModal();
      } else {
        const ok = await updateProjectData(modalData.id, values);
        if (ok) closeModal();
      }
    } else if (modalType === 'task') {
      if (modalMode === 'create') {
        const ok = await createTaskData(values);
        if (ok) closeModal();
      } else {
        const ok = await updateTaskData(modalData.id, values);
        if (ok) closeModal();
      }
    } else if (modalType === 'user') {
      if (modalMode === 'create') {
        const ok = await createUserData(values);
        if (ok) closeModal();
      } else {
        const ok = await updateUser(modalData.id, values);
        if (ok) closeModal();
      }
    }
  }

  return {
    mode,
    setMode,
    user,
    setUser,
    logout,
    projects,
    tasks,
    users,
    modalOpen,
    modalType,
    modalMode,
    tasksFilterDept,
    tasksFilterProject,
    tasksFilterStatus,
  projectsFilterStatus,
    modalData,
    modalDept,
    dashboardView,
    setDashboardView,
    toasts,
    modalSubmitting,
    plannedCount,
    activeCount,
    completedCount,
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
  };
}
