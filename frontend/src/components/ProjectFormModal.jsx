import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export default function ProjectFormModal({ modalMode = 'create', modalData = null, onClose = () => {}, onSubmit = async () => {} }) {
  const [submitting, setSubmitting] = useState(false);
  const addIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  );

  const editIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21v-3.75L14.06 6.19l3.75 3.75L6.75 21H3z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.06 6.19l3.75 3.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  const { todayDate, fmtLocal } = useDateState(modalData);
  // date/time pieces for start/end with AM/PM
  const [startDateDate, setStartDateDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [startPeriod, setStartPeriod] = useState('AM');
  const [endDateDate, setEndDateDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [endPeriod, setEndPeriod] = useState('AM');

  // initialize from modalData
  useEffect(() => {
    if (modalData?.startDate) {
      const s = new Date(modalData.startDate);
      setStartDateDate(fmtLocal(s, false));
      setStartTime(String(s.getHours()).padStart(2, '0') + ':' + String(s.getMinutes()).padStart(2, '0'));
      setStartPeriod(s.getHours() >= 12 ? 'PM' : 'AM');
    } else {
      setStartDateDate(''); setStartTime(''); setStartPeriod('AM');
    }
    if (modalData?.endDate) {
      const e = new Date(modalData.endDate);
      setEndDateDate(fmtLocal(e, false));
      setEndTime(String(e.getHours()).padStart(2, '0') + ':' + String(e.getMinutes()).padStart(2, '0'));
      setEndPeriod(e.getHours() >= 12 ? 'PM' : 'AM');
    } else {
      setEndDateDate(''); setEndTime(''); setEndPeriod('AM');
    }
  }, [modalData]);

  return (
  <Modal title={modalMode === 'create' ? 'Create Project' : 'Edit Project'} onClose={onClose} icon={modalMode === 'create' ? addIcon : editIcon}>
      <form onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
          const f = new FormData(e.target);
          // build start/end ISO datetimes from separate date/time/period pieces
          let startISO = null; let endISO = null;
          let startObj = null; let endObj = null;
          if (startDateDate) {
            const [y, m, d] = startDateDate.split('-').map((x) => Number(x));
            let [h, mm] = (startTime || '00:00').split(':').map((x) => Number(x));
            if (startPeriod === 'PM' && h < 12) h += 12;
            if (startPeriod === 'AM' && h === 12) h = 0;
            startObj = new Date(y, m - 1, d, h, mm, 0, 0);
            startISO = startObj.toISOString();
          }
          if (endDateDate) {
            const [y, m, d] = endDateDate.split('-').map((x) => Number(x));
            let [h, mm] = (endTime || '00:00').split(':').map((x) => Number(x));
            if (endPeriod === 'PM' && h < 12) h += 12;
            if (endPeriod === 'AM' && h === 12) h = 0;
            endObj = new Date(y, m - 1, d, h, mm, 0, 0);
            endISO = endObj.toISOString();
          }
          // validation: start not in past, end not before start
          if (startObj) {
            const now = new Date();
            if (startObj < now) { alert('Start date and time cannot be in the past'); return; }
            if (endObj && endObj < startObj) { alert('End date and time cannot be before start'); return; }
          }
          const body = { name: f.get('name'), description: f.get('description'), status: f.get('status'), startDate: startISO, endDate: endISO };
          await onSubmit(body);
        } finally { setSubmitting(false); }
      }}>
        <div className="profile-field">
          <label htmlFor="project-name">Project name</label>
          <input id="project-name" name="name" defaultValue={modalData?.name || ''} placeholder="Project name" required />
        </div>
        <div className="profile-field">
          <label htmlFor="project-desc">Description</label>
          <input id="project-desc" name="description" defaultValue={modalData?.description || ''} placeholder="Description" />
        </div>
        <div className="field-row">
          <div className="half profile-field">
            <label htmlFor="project-status">Status</label>
            <select id="project-status" name="status" defaultValue={modalData?.status || 'planned'}>
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {/* owner field removed - creator will be recorded automatically */}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="profile-field">
            <label htmlFor="project-start">Start date and time</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input id="project-start-date" type="date" value={startDateDate} min={todayDate} onChange={(e) => setStartDateDate(e.target.value)} />
              <input id="project-start-time" type="time" value={startTime} onChange={(e) => { const v = e.target.value || '00:00'; setStartTime(v); const hr = Number(v.split(':')[0] || 0); setStartPeriod(hr >= 12 ? 'PM' : 'AM'); }} />
              <select id="project-start-period" value={startPeriod} onChange={(e) => {
                const newPeriod = e.target.value; let [h, m] = (startTime || '00:00').split(':').map((x) => Number(x));
                if (newPeriod === 'PM' && h < 12) h += 12; if (newPeriod === 'AM' && h >= 12) h -= 12;
                setStartTime(String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'));
                setStartPeriod(newPeriod);
              }}>
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>
          <div className="profile-field">
            <label htmlFor="project-end">End date and time</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input id="project-end-date" type="date" value={endDateDate} min={startDateDate || todayDate} onChange={(e) => setEndDateDate(e.target.value)} />
              <input id="project-end-time" type="time" value={endTime} onChange={(e) => { const v = e.target.value || '00:00'; setEndTime(v); const hr = Number(v.split(':')[0] || 0); setEndPeriod(hr >= 12 ? 'PM' : 'AM'); }} />
              <select id="project-end-period" value={endPeriod} onChange={(e) => {
                const newPeriod = e.target.value; let [h, m] = (endTime || '00:00').split(':').map((x) => Number(x));
                if (newPeriod === 'PM' && h < 12) h += 12; if (newPeriod === 'AM' && h >= 12) h -= 12;
                setEndTime(String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'));
                setEndPeriod(newPeriod);
              }}>
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button type="button" className="link link-cancel" onClick={onClose}>Cancel</button>
          <button className="main-button" type="submit" disabled={submitting}>{modalMode === 'create' ? (submitting ? 'Creating...' : 'Create') : (submitting ? 'Saving...' : 'Save')}</button>
        </div>
      </form>
    </Modal>
  );
}

// manage date state so we can restrict start date to not be in the past
function useDateState(modalData) {
  // Helper: format a Date (or date-string) into local YYYY-MM-DD
  function fmtLocal(d, includeTime = false) {
    if (!d) return '';
    const dt = new Date(d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    if (!includeTime) return `${yyyy}-${mm}-${dd}`;
    const hh = String(dt.getHours()).padStart(2, '0');
    const min = String(dt.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }
  const nowDatetime = fmtLocal(new Date(), true);
  const todayDate = fmtLocal(new Date(), false);
  return { nowDatetime, todayDate, fmtLocal };
}
