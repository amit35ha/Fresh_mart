import React, { useState } from 'react';
import { X, User, Mail, Shield, Save, Key, Image } from 'lucide-react';

const PRESET_AVATARS = ['😊', '🦊', '🐼', '🐱', '🥑', '🥦', '🍪', '☕'];

export default function UserProfileModal({ isOpen, onClose, currentUser, onUpdateProfile, addToast }) {
  const [name, setName] = useState(currentUser ? currentUser.name : '');
  const [avatar, setAvatar] = useState(currentUser ? currentUser.photo || '😊' : '😊');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !currentUser) return null;

  const isGoogle = !!currentUser.isGoogle;
  const isBase64Avatar = avatar && avatar.startsWith('data:');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setErrorMsg('Avatar image size cannot exceed 1MB.');
      return;
    }

    if (!file.type.match('image.*')) {
      setErrorMsg('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 120;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setAvatar(compressedBase64);
        setErrorMsg('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Full name cannot be empty.');
      return;
    }

    if (!isGoogle && password) {
      if (!currentPassword) {
        setErrorMsg('Current password is required to change password.');
        return;
      }
      if (password.length < 8) {
        setErrorMsg('New password must be at least 8 characters long.');
        return;
      }
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasDigit = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      if (!(hasUpper && hasLower && hasDigit && hasSpecial)) {
        setErrorMsg('Password must contain uppercase, lowercase, numbers, and symbols.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }

    onUpdateProfile({
      name: name.trim(),
      photo: avatar,
      password: !isGoogle && password ? password : undefined,
      currentPassword: !isGoogle && password ? currentPassword : undefined
    });
    
    // Toast and close are handled by parent if there's no network error, but we can close it
    onClose();
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div 
        className="auth-card" 
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', fontWeight: 800, color: 'var(--bg-nav)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <User className="w-5 h-5" />
            My Account Profile
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Manage your personal credentials and customer avatar
          </p>
        </div>

        {errorMsg && (
          <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '12px', background: 'var(--danger-light)', padding: '8px 10px', borderRadius: '6px', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* Avatar display & editor */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', background: 'var(--bg-card-sec)', border: '2.5px solid var(--bg-nav)', overflow: 'hidden', fontSize: '2.2rem' }}>
              {isBase64Avatar || (isGoogle && avatar.startsWith('http')) ? (
                <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
              ) : (
                avatar
              )}
            </div>

            {/* Avatar Selectors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Choose custom avatar emoji</span>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {PRESET_AVATARS.map((emoji, idx) => (
                  <span
                    key={idx}
                    onClick={() => setAvatar(emoji)}
                    style={{ fontSize: '1.25rem', cursor: 'pointer', padding: '4px', borderRadius: '4px', border: avatar === emoji ? '2px solid var(--primary)' : '1px solid transparent', background: avatar === emoji ? 'var(--primary-light)' : 'transparent' }}
                  >
                    {emoji}
                  </span>
                ))}
              </div>

              {/* Upload image */}
              <label 
                htmlFor="profile-avatar-upload" 
                style={{ fontSize: '0.72rem', color: 'var(--bg-nav)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'underline', marginTop: '4px', fontWeight: 'bold' }}
              >
                <Image className="w-3 h-3" />
                Upload Photo File
              </label>
              <input
                type="file"
                id="profile-avatar-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Account Role Badge */}
            <div className="auth-form-group">
              <label>Role</label>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--bg-card-sec)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: currentUser.role === 'admin' ? 'var(--secondary)' : 'var(--bg-nav)' }}>
                <Shield className="w-3.5 h-3.5" />
                <span>{currentUser.role === 'admin' ? 'Administrator' : 'Customer'}</span>
              </div>
            </div>

            {/* Email Address (Disabled) */}
            <div className="auth-form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="input-field"
                  value={currentUser.email}
                  disabled
                  style={{ paddingLeft: '38px', opacity: 0.7, cursor: 'not-allowed', background: 'var(--bg-card-sec)' }}
                />
                <Mail className="absolute text-gray-400 w-4 h-4" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Full Name */}
            <div className="auth-form-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <User className="absolute text-gray-400 w-4 h-4" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Password Updates (Only for non-Google users) */}
            {!isGoogle && (
              <>
                <div className="auth-form-group">
                  <label>Change Password (Optional)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="input-field"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingLeft: '38px' }}
                    />
                    <Key className="absolute text-gray-400 w-4 h-4" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {password && (
                  <div className="auth-form-group">
                    <label>Confirm New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="input-field"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ paddingLeft: '38px' }}
                      />
                      <Key className="absolute text-gray-400 w-4 h-4" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>
                )}
              </>
            )}

            {isGoogle && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--success-light)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '8px 10px', borderRadius: '6px', fontWeight: 600 }}>
                Signed in via Google OAuth. Password details are managed by Google.
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '8px' }}
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Updates</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
