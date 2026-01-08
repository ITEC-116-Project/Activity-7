import React from 'react';
import useSignup from '../hooks/useSignup';
import { useState } from 'react';
import CustomSelect from '../components/CustomSelect';

export default function Signup({ onSubmit, switchToLogin }) {
  const { showPwd, toggleShowPwd, showConfirm, toggleShowConfirm } = useSignup();
  const [department, setDepartment] = useState('');

  return (
    <div className="auth-card">
      <div className="auth-card-logo">
        <img src="/assets/clipboard.svg" alt="Task logo" className="site-logo" />
      </div>
      <h2 className="auth-card-title">Welcome</h2>
      <p className="auth-card-sub">Please enter your details to sign up</p>
      <form className="auth-form" onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="form-field full">
            <label htmlFor="signup-name">Enter Full Name:</label>
            <input id="signup-name" name="name" placeholder="Full name" required />
          </div>

          <div className="form-field">
            <label htmlFor="signup-dept">Select Department:</label>
            <CustomSelect
              options={[
                { value: 'Admin', label: 'Admin Department' },
                { value: 'HR', label: 'HR Department' },
                { value: 'IT', label: 'IT Department' },
                { value: 'Sales', label: 'Sales Department' },
                { value: 'Finance', label: 'Finance Department' },
              ]}
              value={department}
              onChange={(v) => setDepartment(v)}
              className=""
              placeholder="Select Department"
            />
            <input id="signup-dept" type="hidden" name="department" value={department} />
          </div>

          <div className="form-field">
            <label htmlFor="signup-company">Enter ID#:</label>
            <input
              id="signup-company"
              name="companyId"
              placeholder="Company ID Number"
              required
              inputMode="numeric"
              pattern="\d*"
              title="Numbers only"
              onKeyDown={(e) => {
                // allow control keys and digits only
                const allowedKeys = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'];
                if (allowedKeys.includes(e.key) || (e.ctrlKey || e.metaKey)) return;
                if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
              }}
              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ''); }}
            />
          </div>

          <div className="form-field">
            <label htmlFor="signup-username">Enter Username:</label>
            <input id="signup-username" name="username" placeholder="Username" required />
          </div>

          <div className="form-field">
            <label htmlFor="signup-email">Enter Email:</label>
            <input id="signup-email" name="email" type="email" placeholder="Email" required />
          </div>

          <div className="form-field full">
            <label htmlFor="signup-password">Enter Password:</label>
            <div className="input-wrapper">
              <input id="signup-password" name="password" type={showPwd ? 'text' : 'password'} placeholder="Password" required />
              <button type="button" className="eye-toggle" onClick={toggleShowPwd} aria-label="Toggle password visibility">
                {showPwd ? (
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-field full">
            <label htmlFor="signup-confirm-password">Confirm Password:</label>
            <div className="input-wrapper">
              <input id="signup-confirm-password" name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Confirm Password" required />
              <button type="button" className="eye-toggle" onClick={toggleShowConfirm} aria-label="Toggle password visibility">
                {showConfirm ? (
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
  <button className="main-button" type="submit">Create account</button>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <button type="button" className="link link-accent" onClick={switchToLogin}>Have an account? Log in</button>
        </div>
      </form>
    </div>
  );
}
