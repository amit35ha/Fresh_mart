import { useState } from 'react';
import { ClipboardList, Calendar, MapPin, Phone, CreditCard } from 'lucide-react';
import InvoiceModal from './InvoiceModal';

export default function Orders({ orders, setCurrentTab, currentUser, onOpenAuth }) {
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // If not logged in, prompt user to log in
  if (!currentUser) {
    return (
      <div className="glass-panel no-items-state" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <ClipboardList className="no-items-icon" style={{ width: '56px', height: '56px' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>Sign In to View Orders</h3>
        <p style={{ color: 'var(--text-muted)' }}>You must be logged in to access your order logs.</p>
        <button onClick={onOpenAuth} className="btn-primary" style={{ marginTop: '12px', borderRadius: '10px' }}>
          Sign In / Create Account
        </button>
      </div>
    );
  }

  // Filter orders matching current user email (admins see all orders in order history too)
  const filteredOrders = currentUser.role === 'admin' 
    ? orders 
    : orders.filter(o => o.shippingDetails && o.shippingDetails.customerEmail === currentUser.email);

  if (filteredOrders.length === 0) {
    return (
      <div className="glass-panel no-items-state" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <ClipboardList className="no-items-icon" style={{ width: '56px', height: '56px' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>No Orders Found</h3>
        <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet. Visit the catalog to buy items.</p>
        <button onClick={() => setCurrentTab('shop')} className="btn-primary" style={{ marginTop: '12px', borderRadius: '10px' }}>
          Explore Shop
        </button>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'processing': return 'badge-warning';
      case 'out for delivery': return 'badge-indigo';
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-indigo';
    }
  };

  return (
    <div className="orders-container animate-fade-in" style={{ maxWidth: '750px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 850, marginBottom: '20px', fontFamily: 'Outfit, sans-serif', color: 'var(--bg-nav)' }}>
        Your Order History
      </h2>

      <div className="orders-list">
        {filteredOrders.map((order) => (
          <div key={order.id} className="glass-panel order-card" style={{ background: 'var(--bg-card)' }}>
            {/* Header */}
            <div className="order-header">
              <div>
                <span className="order-id" style={{ color: 'var(--bg-nav)' }}>{order.orderId}</span>
                <div className="order-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{order.date}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={() => setSelectedInvoiceOrder(order)}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: '6px', height: 'auto' }}
                >
                  View Invoice
                </button>
                <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Content Details Grid */}
            <div className="order-details-grid">
              {/* Items Summary */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 750, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Items Summary
                </h4>
                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-row" style={{ fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {item.name} <span style={{ color: 'var(--text-muted)' }}>x{item.quantity}</span>
                      </span>
                      <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping info */}
              <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 750, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Delivery Details
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                    {order.shippingDetails.customerName}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone className="w-3.5 h-3.5" />
                    <span>{order.shippingDetails.customerPhone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', flexWrap: 'wrap' }}>
                    <MapPin className="w-3.5 h-3.5" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{order.shippingDetails.customerAddress}</span>
                    {order.shippingDetails.deliveryType === 'takeaway' && (
                      <span className="badge badge-indigo" style={{ padding: '2px 6px', fontSize: '0.6rem', height: 'auto', verticalAlign: 'middle', borderRadius: '4px' }}>Takeaway</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Payment: <strong style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>{order.shippingDetails.paymentMethod}</strong></span>
                  </div>
                </div>

                {/* Subtotals */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    <span>Subtotal:</span>
                    <span>₹{order.shippingDetails.subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    <span>Delivery:</span>
                    <span>{order.shippingDetails.shippingCost === 0 ? 'FREE' : `₹${order.shippingDetails.shippingCost}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 850, fontSize: '0.95rem', color: 'var(--primary)', borderTop: '1px dashed var(--border-color)', paddingTop: '6px' }}>
                    <span>Total paid:</span>
                    <span>₹{order.shippingDetails.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invoice Modal Overlay */}
      {selectedInvoiceOrder && (
        <InvoiceModal 
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
          order={selectedInvoiceOrder}
        />
      )}
    </div>
  );
}
