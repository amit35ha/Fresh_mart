import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQty, onRemoveItem, onCheckout, currentUser, onOpenAuth }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryType, setDeliveryType] = useState('delivery'); // 'delivery' or 'takeaway'
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Pre-fill recipient name if user is logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
    } else {
      setName('');
    }
  }, [currentUser]);

  // Clear success state on drawer close/open
  useEffect(() => {
    if (isOpen) {
      setOrderSuccess(false);
      setErrorMsg('');
      setDeliveryType('delivery');
    }
  }, [isOpen]);

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const subtotal = getSubtotal();
  const shipping = deliveryType === 'takeaway' ? 0 : (subtotal > 500 ? 0 : (subtotal > 0 ? 40 : 0));
  const total = subtotal + shipping;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) return setErrorMsg('Recipient Name is required.');
    if (!phone.trim() || phone.trim().length < 10) {
      return setErrorMsg('Please enter a valid 10-digit phone number.');
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      return setErrorMsg('Complete address is required.');
    }

    onCheckout({
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerAddress: deliveryType === 'takeaway' ? 'Store Pickup (Takeaway)' : address.trim(),
      customerEmail: currentUser ? currentUser.email : 'guest@freshkart.com',
      paymentMethod,
      deliveryType,
      shippingCost: shipping,
      subtotal,
      total
    });

    setOrderSuccess(true);
    setName(currentUser ? currentUser.name : '');
    setPhone('');
    setAddress('');
  };

  return (
    <>
      {/* Overlay Background */}
      <div 
        className={`drawer-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      ></div>

      {/* Cart Side panel / Bottom sheet */}
      <div className={`cart-drawer ${isOpen ? 'active' : ''}`}>
        
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <ShoppingCart className="w-5 h-5" />
            <span>Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
          </div>
          <button 
            onClick={onClose} 
            className="btn-ghost" 
            style={{ padding: '6px', color: 'var(--text-primary)', borderRadius: '50%', background: 'var(--border-color)', opacity: 1 }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="cart-drawer-content">
          {orderSuccess ? (
            <div className="no-items-state animate-fade-in" style={{ padding: '24px 0' }}>
              <CheckCircle2 className="w-12 h-12 text-emerald-600" style={{ margin: '0 auto 8px auto', display: 'block' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--bg-nav)' }}>Order Placed!</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '8px 0 16px 0' }}>
                Thank you for shopping at FreshKart. We have received your order successfully.
              </p>
              <button 
                onClick={onClose} 
                className="btn-primary" 
                style={{ borderRadius: '8px', padding: '8px 18px' }}
              >
                Close Drawer
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="no-items-state" style={{ padding: '40px 0' }}>
              <ShoppingCart className="w-10 h-10 text-gray-400" style={{ margin: '0 auto 10px auto', display: 'block' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add delicious items from the catalog.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Cart Items List */}
              <div style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                {cart.map((item) => (
                  <div key={item.id} className="cart-drawer-item">
                    <div className="cart-drawer-img">
                      {item.image && item.image.length < 10 ? item.image : (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                    </div>
                    
                    <div className="cart-drawer-info">
                      <span className="cart-drawer-cat">{item.category}</span>
                      <h4 className="cart-drawer-name">{item.name}</h4>
                      <div className="cart-drawer-price">₹{item.price * item.quantity}</div>
                    </div>

                    {/* Quantity controls */}
                    <div className="cart-drawer-qty-box">
                      <button 
                        onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                        className="cart-drawer-qty-btn"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', minWidth: '14px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        className="cart-drawer-qty-btn"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="btn-ghost"
                      style={{ padding: '4px', color: 'var(--danger)' }}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Order calculations */}
              <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '12px 0', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  <span>Delivery fee</span>
                  <span>{shipping === 0 ? <strong style={{ color: 'var(--success)' }}>FREE</strong> : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Spend <span style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{500 - subtotal}</span> more for Free Delivery!
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', borderTop: '1px dashed var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                  <span>Total Amount</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Checkout Form */}
              <div style={{ marginTop: '4px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '10px', color: 'var(--bg-nav)', fontFamily: 'Outfit, sans-serif' }}>
                  Delivery Details
                </h4>

                {!currentUser && (
                  <div style={{ padding: '8px 10px', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.75rem', borderRadius: '6px', fontWeight: 600, marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)' }}>
                    <span>Checking out as Guest.</span>
                    <button 
                      onClick={() => { onClose(); onOpenAuth(); }}
                      style={{ background: 'transparent', textDecoration: 'underline', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '0.75rem' }}
                    >
                      Sign In
                    </button>
                  </div>
                )}

                {errorMsg && (
                  <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginBottom: '10px', fontWeight: 600 }}>
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handlePlaceOrder}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    <div>
                      <input
                        type="text"
                        placeholder="Recipient Name"
                        className="input-field"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="10-digit Phone Number"
                        className="input-field"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={10}
                        style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <select
                        className="input-field"
                        value={deliveryType}
                        onChange={(e) => setDeliveryType(e.target.value)}
                        style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '0.85rem', height: '37px', cursor: 'pointer', background: 'var(--bg-input)' }}
                      >
                        <option value="delivery">Home Delivery</option>
                        <option value="takeaway">Store Pickup (Takeaway)</option>
                      </select>
                    </div>
                    {deliveryType === 'delivery' ? (
                      <div>
                        <textarea
                          placeholder="Complete Delivery Address"
                          className="input-field"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '0.85rem', minHeight: '60px' }}
                        />
                      </div>
                    ) : (
                      <div style={{ padding: '10px 14px', background: 'var(--bg-card-sec)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <strong>Pickup Location:</strong> Parmanandpur, Sonepur Saran. Near SBI BANK<br/>
                        Pickup timing: 9:00 AM - 9:00 PM. No delivery charges apply.
                      </div>
                    )}
                    <div>
                      <select
                        className="input-field"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '0.85rem', height: '37px', cursor: 'pointer', background: 'var(--bg-input)' }}
                      >
                        <option value="cod">Cash on Delivery (COD)</option>
                        <option value="upi">UPI Scan on Delivery</option>
                        <option value="card">Simulated Card Payment</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <span>Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="cart-drawer-footer">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Secure checkout powered by FreshKart</span>
            <span>v1.2.0</span>
          </div>
        </div>

      </div>
    </>
  );
}
