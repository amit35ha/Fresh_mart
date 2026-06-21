import React from 'react';
import { ShoppingCart, User, ShieldAlert, Sun, Moon, LogOut, ClipboardList } from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  cartCount, 
  currentUser, 
  onOpenAuth, 
  onLogout,
  onOpenCart,
  toggleRole,
  onOpenProfile,
  theme, 
  toggleTheme 
}) {
  return (
    <nav className="glass-nav">
      <div className="container navbar-container">
        {/* Left Side: Brand Logo */}
        <div 
          className="navbar-brand"
          onClick={() => setCurrentTab('shop')}
        >
          <div className="navbar-logo-icon">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="navbar-logo-text">FreshKart</span>
            <span className="navbar-logo-sub">Kirana Store</span>
          </div>
        </div>

        {/* Right Side: Navigation buttons and links aligned */}
        <div className="navbar-actions">
          {/* Shop button */}
          <button 
            onClick={() => setCurrentTab('shop')}
            className={`btn-primary ${currentTab === 'shop' ? '' : 'btn-ghost'}`}
            style={currentTab === 'shop' ? { boxShadow: 'none' } : { color: '#ffffff', opacity: 0.85 }}
          >
            Shop
          </button>

          {/* Orders Link */}
          <button 
            onClick={() => setCurrentTab('orders')}
            className={`btn-ghost ${currentTab === 'orders' ? 'text-amber-300 font-semibold' : ''}`}
            style={{ color: '#ffffff', opacity: 0.85 }}
            title="View Order History"
          >
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline" style={{ marginLeft: '4px' }}>Orders</span>
          </button>

          {/* Admin Panel Link (Only visible to logged-in admins, Staff Door removed for general users) */}
          {currentUser && currentUser.role === 'admin' && (
            <button 
              onClick={toggleRole}
              className="btn-ghost"
              style={{ color: '#ffffff', opacity: 0.85, fontWeight: 500 }}
              title="Admin Dashboard"
            >
              Admin Panel
            </button>
          )}

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="btn-ghost"
            style={{ padding: '8px', color: '#ffffff' }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Sign In / Profile Greeting */}
          {currentUser ? (
            <div className="nav-user-profile">
              <button 
                onClick={onOpenProfile}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', color: '#ffffff', cursor: 'pointer', padding: '2px 6px', borderRadius: '18px' }}
                title="View & Edit Profile"
                className="btn-ghost"
              >
                {currentUser.photo ? (
                  <img 
                    src={currentUser.photo} 
                    alt={currentUser.name} 
                    className="nav-avatar-img"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="nav-avatar-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', color: 'var(--bg-nav)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <span className="hidden md:inline" style={{ fontSize: '0.85rem', opacity: 0.95, fontWeight: 600 }}>
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>

              <button 
                onClick={onLogout}
                className="btn-ghost"
                style={{ padding: '6px', opacity: 0.8, color: '#ffffff' }}
                title="Log Out"
              >
                <LogOut className="w-4 h-4 text-rose-300" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="role-toggle-btn"
              style={{ fontWeight: 600 }}
            >
              Sign In
            </button>
          )}

          {/* Cart Button */}
          <button 
            onClick={onOpenCart}
            className="btn-primary cart-btn-indicator"
            style={{ background: '#e76f51', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden xs:inline">Cart</span>
            <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
