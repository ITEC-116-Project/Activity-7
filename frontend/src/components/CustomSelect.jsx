import React, { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ options = [], value, onChange = () => {}, placeholder = '', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const current = options.find((o) => String(o.value) === String(value));
  const label = current ? current.label : (placeholder || (options[0] && options[0].label) || '');

  return (
    <div className={`custom-select ${className}`} ref={ref}>
      <button type="button" className="main-select select-button" onClick={() => setOpen((s) => !s)} aria-expanded={open} aria-haspopup="listbox">
        <span className="select-label">{label}</span>
        <span className="select-caret">▾</span>
      </button>
      {open && (
        <ul className="select-menu" role="listbox">
          {options.map((o) => (
            <li key={o.value} role="option" aria-selected={String(o.value) === String(value)} className={`select-item ${String(o.value) === String(value) ? 'selected' : ''}`} onClick={() => { onChange(o.value); setOpen(false); }}>
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
