import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Info } from 'lucide-react';

export default function AuthModal({ onClose, onLogin, onRegister, onGoogleLogin }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Error State
  const [errorMsg, setErrorMsg] = useState('');

  // Render Google GSI button if window.google is available
  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        const btnContainer = document.getElementById("google-button-container");
        if (btnContainer) {
          window.google.accounts.id.renderButton(
            btnContainer,
            { theme: "outline", size: "large", width: 364 }
          );
        }
      } catch (err) {
        console.error("GSI Button render error:", err);
      }
    }
  }, [activeTab]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail.trim()) return setErrorMsg('Email is required.');
    if (!loginPassword) return setErrorMsg('Password is required.');

    const success = onLogin(loginEmail.trim(), loginPassword);
    if (!success) {
      setErrorMsg('Invalid email or password.');
    } else {
      onClose();
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName.trim()) return setErrorMsg('Full name is required.');
    if (!regEmail.trim()) return setErrorMsg('Email address is required.');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      return setErrorMsg('Please enter a valid email address.');
    }

    if (regPassword.length < 4) {
      return setErrorMsg('Password must be at least 4 characters long.');
    }
    if (regPassword !== regConfirmPassword) {
      return setErrorMsg('Passwords do not match.');
    }

    const result = onRegister(regName.trim(), regEmail.trim(), regPassword);
    if (!result.success) {
      setErrorMsg(result.message);
    } else {
      onClose();
    }
  };



  return (
    <div className="auth-overlay" onClick={onClose}>
      <div 
        className="auth-card" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Header logo */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div className="navbar-logo-icon" style={{ display: 'inline-flex', background: 'var(--bg-nav)', padding: '6px', borderRadius: '50%', marginBottom: '6px' }}>
            <Lock className="w-4 h-4 text-white" />
          </div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: 'var(--bg-nav)' }}>
            FreshKart Account
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Sign in to check out and track your grocery orders
          </p>
        </div>

        {/* Tab triggers */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '12px', background: 'var(--danger-light)', padding: '8px 10px', borderRadius: '6px', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="auth-form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="input-field"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <Mail className="absolute text-gray-400 w-4 h-4" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="auth-form-group" style={{ marginBottom: '16px' }}>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <Lock className="absolute text-gray-400 w-4 h-4" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', borderRadius: '8px' }}>
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="auth-form-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="input-field"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <User className="absolute text-gray-400 w-4 h-4" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="auth-form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="input-field"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <Mail className="absolute text-gray-400 w-4 h-4" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="auth-form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="Create password"
                  className="input-field"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <Lock className="absolute text-gray-400 w-4 h-4" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="auth-form-group" style={{ marginBottom: '16px' }}>
              <label>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="Verify password"
                  className="input-field"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <Lock className="absolute text-gray-400 w-4 h-4" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', borderRadius: '8px' }}>
              Create Account
            </button>
          </form>
        )}

        {/* Separator for Google Login */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          <span style={{ padding: '0 8px', fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
        </div>

        {/* Real Google GSI container */}
        <div id="google-button-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}></div>

        {/* Toggle link below form */}
        <div className="auth-footer-prompt">
          {activeTab === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button 
                onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                className="auth-footer-link"
              >
                Sign Up Free
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button 
                onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                className="auth-footer-link"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
