import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Cart({ cart, onUpdateQty, onRemoveItem, onCheckout, setCurrentTab, currentUser, onOpenAuth }) {
  const [name, setName] = useState(currentUser ? currentUser.name : '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [prevUser, setPrevUser] = useState(currentUser);
  if (currentUser !== prevUser) {
    setPrevUser(currentUser);
    setName(currentUser ? currentUser.name : '');
  }

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const subtotal = getSubtotal();
  const shipping = subtotal > 500 ? 0 : (subtotal > 0 ? 40 : 0);
  const total = subtotal + shipping;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please enter your complete address.');
      return;
    }

    onCheckout({
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerAddress: address.trim(),
      customerEmail: currentUser.email, // link to customer email
      paymentMethod,
      shippingCost: shipping,
      subtotal,
      total
    });

    setOrderSuccess(true);
    setName('');
    setPhone('');
    setAddress('');
  };

  if (orderSuccess) {
    return (
      <div className="glass-panel no-items-state" style={{ maxWidth: '600px', margin: '40px auto', padding: '40px 20px' }}>
        <CheckCircle2 className="no-items-icon" style={{ color: 'var(--bg-nav)', width: '64px', height: '64px' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '8px' }}>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: '8px 0 20px 0', fontSize: '0.9rem' }}>
          Thank you for shopping at FreshKart. We have received your order and will deliver it shortly.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => setCurrentTab('orders')} className="btn-secondary">
            View History
          </button>
          <button onClick={() => { setOrderSuccess(false); setCurrentTab('shop'); }} className="btn-primary">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="glass-panel no-items-state" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <ShoppingCart className="no-items-icon" style={{ width: '56px', height: '56px' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Cart is Empty</h3>
        <p style={{ color: 'var(--text-muted)' }}>Looks like you haven't added any products to your cart yet.</p>
        <button onClick={() => setCurrentTab('shop')} className="btn-primary" style={{ marginTop: '12px' }}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-grid animate-fade-in">
      {/* Left Column: Cart Items list */}
      <div className="cart-items-list">
        <h2 style={{ fontSize: '1.4rem', fontWeight: 850, marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Shopping Cart ({cart.length} Items)</h2>
        {cart.map((item) => (
          <div key={item.id} className="glass-panel cart-item-card">
            {/* Emoji or Image */}
            <div className="cart-item-img">
              {item.image && item.image.length < 10 ? item.image : "📦"}
            </div>

            <div className="cart-item-info">
              <span className="cart-item-category">{item.category}</span>
              <h3 className="cart-item-title">{item.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                <span>Unit Price: ₹{item.price}</span>
              </div>
            </div>

            {/* Quantity adjustment */}
            <div className="cart-item-qty">
              <button 
                onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                className="cart-item-qty-btn"
                title="Decrease Quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span style={{ fontWeight: 700, minWidth: '16px', textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
              <button 
                onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                className="cart-item-qty-btn"
                title="Increase Quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Price & Delete */}
            <div className="cart-item-price-panel">
              <span className="cart-item-price">₹{item.price * item.quantity}</span>
              <button 
                onClick={() => onRemoveItem(item.id)}
                className="btn-ghost"
                style={{ padding: '4px', color: 'var(--danger)' }}
                title="Remove Item"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Right Column: Checkout & Summary */}
      <div className="cart-summary">
        <div className="glass-panel cart-summary-panel">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>{shipping === 0 ? <span style={{ color: 'var(--success)', fontWeight: 700 }}>FREE</span> : `₹${shipping}`}</span>
          </div>
          
          {shipping > 0 && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '14px', marginTop: '-8px' }}>
              Add items worth <span style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{500 - subtotal}</span> more for Free Delivery!
            </div>
          )}

          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>

          {/* Checkout Details Form or Guest Sign In Box */}
          <div className="checkout-form-panel">
            {currentUser ? (
              <>
                <h3 className="checkout-title">Delivery Details</h3>
                
                {errorMsg && (
                  <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '12px', fontWeight: 600 }}>
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handlePlaceOrder}>
                  <div className="checkout-grid">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        className="input-field"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ borderRadius: '10px', padding: '10px 14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit number"
                        className="input-field"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={10}
                        style={{ borderRadius: '10px', padding: '10px 14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                        Delivery Address
                      </label>
                      <textarea
                        placeholder="Street, Landmark, Pincode"
                        className="input-field"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                        Payment Method
                      </label>
                      <select
                        className="input-field"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ background: '#ffffff', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '10px', padding: '10px 14px' }}
                      >
                        <option value="cod">Cash on Delivery (COD)</option>
                        <option value="upi">UPI Scan on Delivery</option>
                        <option value="card">Simulated Card Payment</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '10px' }}>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="guest-prompt-box">
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px', color: 'var(--bg-nav)', fontFamily: 'Outfit, sans-serif' }}>
                  Checkout Sign In Required
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
                  Please register an account or sign in to complete your checkout process.
                </p>
                <button 
                  onClick={onOpenAuth}
                  className="btn-primary"
                  style={{ width: '100%', padding: '10px', borderRadius: '10px' }}
                >
                  Sign In / Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
