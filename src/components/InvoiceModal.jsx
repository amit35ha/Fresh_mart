import { X, Printer } from 'lucide-react';

export default function InvoiceModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    // Print styling is managed in index.css using @media print
    window.print();
  };

  const shippingDetails = order.shippingDetails || {};
  const items = order.items || [];
  const deliveryType = shippingDetails.deliveryType === 'takeaway' ? 'Store Pickup (Takeaway)' : 'Home Delivery';

  return (
    <div className="auth-overlay no-print" onClick={onClose}>
      <div 
        className="auth-card printable-invoice-card" 
        style={{ maxWidth: '650px', width: '100%', padding: '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="modal-close-btn no-print" onClick={onClose}>
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Invoice Printable Area */}
        <div id="invoice-print-area">
          {/* Invoice Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--bg-nav)', margin: 0 }}>FreshKart</h1>
              <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.12em', fontWeight: 700, display: 'block' }}>Kirana Supermart</span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                <strong>Shop Address:</strong><br />
                Parmanandpur, Sonepur Saran.<br />
                Near SBI BANK
              </p>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>INVOICE</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div><strong>Invoice No:</strong> {order.orderId}</div>
                <div><strong>Date & Time:</strong> {order.date}</div>
                <div><strong>Status:</strong> {order.status}</div>
              </div>
            </div>
          </div>

          {/* Customer & Billing Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', fontSize: '0.82rem' }}>
            <div>
              <h3 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '3px' }}>Customer Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-secondary)' }}>
                <div><strong>Name:</strong> {shippingDetails.customerName}</div>
                <div><strong>Phone:</strong> {shippingDetails.customerPhone}</div>
                <div><strong>Email:</strong> {shippingDetails.customerEmail}</div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '3px' }}>Billing Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-secondary)' }}>
                <div><strong>Option:</strong> {deliveryType}</div>
                <div><strong>Payment:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{shippingDetails.paymentMethod}</span></div>
                <div><strong>Address:</strong> {shippingDetails.customerAddress}</div>
              </div>
            </div>
          </div>

          {/* Items Summary Table */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card-sec)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Item Name</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, textAlign: 'center' }}>Price</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: idx === items.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{item.name}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>₹{item.price}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 650 }}>x{item.quantity}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700 }}>₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.85rem' }}>
            <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{shippingDetails.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Delivery Charge</span>
                <span>{shippingDetails.shippingCost === 0 ? 'FREE' : `₹${shippingDetails.shippingCost}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 850, fontSize: '1rem', color: 'var(--primary)', borderTop: '1px dashed var(--border-color)', paddingTop: '6px', marginTop: '2px' }}>
                <span>Total Amount</span>
                <span>₹{shippingDetails.total}</span>
              </div>
            </div>
          </div>

          {/* Invoice Footer note */}
          <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '24px', paddingTop: '12px', textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>Thank you for shopping at FreshKart! This is a system-generated printable receipt.</span>
          </div>
        </div>

        {/* Print Action Trigger */}
        <button 
          onClick={handlePrint}
          className="btn-primary no-print"
          style={{ width: '100%', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '24px' }}
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Invoice (PDF)</span>
        </button>
      </div>
    </div>
  );
}
