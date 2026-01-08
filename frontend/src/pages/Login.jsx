import React from 'react';
import useLogin from '../hooks/useLogin';

export default function Login({ onSubmit, switchToSignup }) {
  const { showPwd, toggleShowPwd } = useLogin();

  return (
    <div className="auth-card">
      <div className="auth-card-logo">
        <img src="/assets/clipboard.svg" alt="Task logo" className="site-logo" />
      </div>
      <h2 className="auth-card-title">Welcome</h2>
      <p className="auth-card-sub">Please enter your details to sign in</p>
      <form className="auth-form" onSubmit={onSubmit}>
        <label htmlFor="login-username">Enter Username:</label>
        <input id="login-username" name="username" placeholder="Username" required />
        <label htmlFor="login-password">Enter Password:</label>
        <div className="input-wrapper">
          <input id="login-password" name="password" type={showPwd ? 'text' : 'password'} placeholder="Password" required />
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
        <button className="main-button" type="submit">Log In</button>
        <div style={{display:'flex', justifyContent:'center', marginTop:8}}>
          <button type="button" className="link link-accent" onClick={switchToSignup}>Create account</button>
        </div>
      </form>
    </div>
  );
}
