import React, { useState, useMemo } from 'react';
import Modal from './Modal';

export default function TaskFormModal({
  modalMode = 'create',
  modalData = null,
  projects = [],
  users = [],
  currentUser = null,
  onClose = () => {},
  onSubmit = async () => {},
}) {
  const isCreate = modalMode === 'create';
  const isView = modalMode === 'view';
  const [submitting, setSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState(modalData?.project?.id || '');
  const [dept, setDept] = useState(isCreate ? '' : (modalData?.assignedTo?.department || ''));
  const [statusValue, setStatusValue] = useState(isCreate ? '' : (modalData?.status || 'pending'));
  const [deadlineValue, setDeadlineValue] = useState(() => {
    if (modalData?.deadline) return new Date(modalData.deadline).toISOString().slice(0, 16);
    if (modalData?.project?.endDate) return new Date(modalData.project.endDate).toISOString().slice(0, 16);
    return '';
  });
  const [projectDates, setProjectDates] = useState(() => ({
    start: modalData?.project?.startDate || '',
    end: modalData?.project?.endDate || '',
  }));
  const taskIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h5l2 3 5-6 6 12H3z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  const viewIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2"/><path d="M12 9v6M12 15h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  const editIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21v-3.75L14.06 6.19l3.75 3.75L6.75 21H3z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.06 6.19l3.75 3.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );

  const filteredUsers = useMemo(() => {
    // Exclude manager accounts from the assign-to list
    const nonManager = users.filter((u) => (u.role || '').toLowerCase() !== 'manager');
    if (!dept) return nonManager;
    return nonManager.filter((u) => u.department === dept);
  }, [dept, users]);

  const createdProjects = useMemo(() => {
    if (!Array.isArray(projects) || projects.length === 0) return [];
    if (!currentUser) return projects;
    return projects.filter((project) => {
      const ownerIdMatches = project?.owner?.id && currentUser.id && project.owner.id === currentUser.id;
      const ownerCompanyMatches = (() => {
        const projectCompany = project?.owner?.companyId || project?.ownerId;
        if (!projectCompany || !currentUser?.companyId) return false;
        return String(projectCompany) === String(currentUser.companyId);
      })();
      return ownerIdMatches || ownerCompanyMatches;
    });
  }, [projects, currentUser]);

  const projectOptions = useMemo(() => {
    if (!selectedProject) return createdProjects;
    const exists = createdProjects.some((p) => String(p.id) === String(selectedProject));
    if (exists) return createdProjects;
    const selected = projects.find((p) => String(p.id) === String(selectedProject));
    return selected ? [...createdProjects, selected] : createdProjects;
  }, [createdProjects, selectedProject, projects]);

  function handleProjectChange(e) {
    const value = e.target.value;
    setSelectedProject(value);
    const project = projects.find((p) => String(p.id) === String(value));
    if (value && (!dept || isCreate)) {
      setDept(currentUser?.department || project?.owner?.department || project?.owner?.department || '');
    }
    if (project) {
      setProjectDates({ start: project.startDate || '', end: project.endDate || '' });
      if (project.endDate) {
        setDeadlineValue(new Date(project.endDate).toISOString().slice(0, 16));
      }
      if (project.status) {
        setStatusValue(project.status);
      }
    } else if (isCreate) {
      setProjectDates({ start: '', end: '' });
      setStatusValue('');
      setDeadlineValue('');
    }
  }

  function formatStatusLabel(value) {
    if (!value) return '—';
    if (value === 'pending') return 'Pending';
    if (value === 'in_progress') return 'In Progress';
    if (value === 'done') return 'Completed';
    return value;
  }

  return (
  <Modal title={modalMode === 'create' ? 'Create Task' : (isView ? 'Task details' : 'Edit Task')} onClose={onClose} icon={modalMode === 'create' ? taskIcon : (isView ? viewIcon : editIcon)}>
      {isView ? (
        <div className="task-view">
          <div className="profile-field"><label>Title</label><div>{modalData?.title || '—'}</div></div>
          <div className="profile-field"><label>Description</label><div>{modalData?.description || '—'}</div></div>
          <div className="profile-field"><label>Project</label><div>{modalData?.project?.name || '—'}</div></div>
          <div className="profile-field"><label>Assigned To</label><div>{modalData?.assignedTo?.name || modalData?.assignedTo?.email || '—'}</div></div>
          <div className="profile-field"><label>Status</label><div>{modalData?.status || '—'}</div></div>
          <div className="profile-field"><label>Date &amp; Time</label><div>{modalData?.deadline ? new Date(modalData.deadline).toLocaleString() : (modalData?.project?.endDate ? new Date(modalData.project.endDate).toLocaleString() : '—')}</div></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" className="link link-close" onClick={onClose}>Close</button>
            {currentUser?.role !== 'manager' && modalData?.status !== 'done' && (
              <button className="main-button" type="button" onClick={async () => { setSubmitting(true); try { await onSubmit({ status: 'done' }); } finally { setSubmitting(false); } }}>{submitting ? 'Saving...' : 'Mark done'}</button>
            )}
          </div>
        </div>
      ) : (
      <form onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
          const f = new FormData(e.target);
          const resolvedStatus = isCreate ? 'pending' : (statusValue || 'pending');
          const resolvedDeadline = (() => {
            if (isCreate) {
              const autoSource = projectDates.end || projectDates.start || '';
              if (!autoSource) return null;
              const parsed = new Date(autoSource);
              return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
            }
            if (!deadlineValue) return null;
            const parsed = new Date(deadlineValue);
            return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
          })();
          const body = {
            title: f.get('title'),
            description: f.get('description'),
            status: resolvedStatus,
            deadline: resolvedDeadline,
            projectId: selectedProject || null,
            assignedToId: f.get('assignedTo') || null,
          };
          await onSubmit(body);
        } finally { setSubmitting(false); }
      }}>
        <input name="title" defaultValue={modalData?.title || ''} placeholder="Task title" required />
        <input name="description" defaultValue={modalData?.description || ''} placeholder="Description" />
        <select name="project" value={selectedProject} onChange={handleProjectChange}>
          <option value="">No project</option>
          {projectOptions.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
        </select>
        {isCreate ? (
          <div className="plain-field">
            <label>Department</label>
            <span>{dept || '—'}</span>
          </div>
        ) : (
          <select name="department" value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="">All departments</option>
            <option value="Admin">Admin</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
          </select>
        )}
        <select name="assignedTo" defaultValue={modalData?.assignedTo?.id || ''}>
          <option value="">Assign to: </option>
          {filteredUsers.map((u) => (<option key={u.id} value={u.id}>{u.name || u.email} — {u.department}</option>))}
        </select>
        {isCreate ? (
          <div className="plain-field">
            <label>Task Status</label>
            <span>{formatStatusLabel(statusValue)}</span>
          </div>
        ) : (
          <select name="status" value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Completed</option>
          </select>
        )}
        {isCreate ? (
          <div className="plain-field">
            <label>Date &amp; Time</label>
            <span>
              {projectDates.start || projectDates.end
                ? `${projectDates.start ? `Start: ${new Date(projectDates.start).toLocaleString()}` : ''}${projectDates.start && projectDates.end ? ' | ' : ''}${projectDates.end ? `End: ${new Date(projectDates.end).toLocaleString()}` : ''}`
                : '—'}
            </span>
          </div>
        ) : (
          <input
            name="deadline"
            type="datetime-local"
            value={deadlineValue}
            onChange={(e) => setDeadlineValue(e.target.value)}
          />
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button type="button" className="link" onClick={onClose}>Cancel</button>
          <button className="main-button" type="submit" disabled={submitting}>{modalMode === 'create' ? (submitting ? 'Creating...' : 'Create') : (submitting ? 'Saving...' : 'Save')}</button>
        </div>
      </form>
      )}
    </Modal>
  );
}
