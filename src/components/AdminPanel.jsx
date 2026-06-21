import { useState } from 'react';
import { PlusCircle, Trash2, ShieldAlert, BarChart3, ShoppingBag, Landmark, MessageSquare, Search, Edit3, Upload, XCircle } from 'lucide-react';
import InvoiceModal from './InvoiceModal';

const PRESET_IMAGES = [
  { name: 'Apples', url: '🍎' },
  { name: 'Carrots', url: '🥕' },
  { name: 'Bananas', url: '🍌' },
  { name: 'Avocado', url: '🥑' },
  { name: 'Milk', url: '🥛' },
  { name: 'Cheese', url: '🧀' },
  { name: 'Butter', url: '🧈' },
  { name: 'Bread', url: '🍞' },
  { name: 'Cola', url: '🥤' },
  { name: 'Chips', url: '🍟' },
  { name: 'Soap', url: '🧼' },
  { name: 'Detergent', url: '🧴' },
  { name: 'Honey', url: '🍯' }
];

export default function AdminPanel({ products, orders, onAddProduct, onUpdateProduct, onDeleteProduct, onUpdateOrderStatus, categories }) {
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Product CRUD Form State
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[1] || 'Produce');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('🍎'); // base64 or emoji
  const [inStock, setInStock] = useState('50');
  const [description, setDescription] = useState('');
  
  // Validation/Alert states
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Table Search state
  const [tableSearch, setTableSearch] = useState('');

  // Load editing product details into form
  const handleStartEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price.toString());
    setImage(product.image);
    setInStock(product.inStock ? product.inStock.toString() : '0');
    setDescription(product.description);
    setFormError('');
    setFormSuccess('');
    // Scroll form into view on mobile
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setImage('🍎');
    setInStock('50');
    setDescription('');
    setFormError('');
    setFormSuccess('');
  };

  // Image Upload with Canvas Resizer (compress to JPG < 30KB)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setFormError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setImage(compressedBase64);
        setFormError('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Submit Handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name.trim()) return setFormError('Product Name is required.');
    if (!price || parseFloat(price) <= 0) return setFormError('Price must be a valid positive number.');
    if (!image.trim()) return setFormError('Product Image / Emoji is required.');
    if (!inStock || parseInt(inStock) < 0) return setFormError('Stock count must be a non-negative integer.');
    if (!description.trim()) return setFormError('Description is required.');

    const productPayload = {
      name: name.trim(),
      category,
      price: parseFloat(price),
      image: image.trim(),
      inStock: parseInt(inStock),
      description: description.trim()
    };

    if (editingProduct) {
      // Edit mode
      onUpdateProduct(editingProduct.id, productPayload);
      setFormSuccess(`Product "${name}" updated successfully!`);
      setEditingProduct(null);
    } else {
      // Add mode
      onAddProduct({
        id: Date.now(),
        ...productPayload,
        reviews: []
      });
      setFormSuccess(`Product "${name}" published successfully!`);
    }

    // Reset fields
    setName('');
    setPrice('');
    setImage('🍎');
    setInStock('50');
    setDescription('');
  };

  // KPI Calculations
  const totalProducts = products.length;
  const totalSales = orders.reduce((sum, order) => {
    if (order.status.toLowerCase() !== 'cancelled') {
      return sum + order.shippingDetails.total;
    }
    return sum;
  }, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status.toLowerCase() === 'processing').length;
  const totalReviews = products.reduce((sum, p) => sum + (p.reviews ? p.reviews.length : 0), 0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const isBase64Image = image && image.startsWith('data:');

  return (
    <div className="admin-container animate-fade-in">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        <h2 className="admin-header-title" style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert className="w-7 h-7" />
          Store Back Office Dashboard
        </h2>
        <span style={{ fontSize: '0.8rem', background: 'var(--secondary)', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>
          ADMIN ACCESS ACTIVE
        </span>
      </div>

      {/* KPI Stats Grid */}
      <div className="admin-stats-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon-box" style={{ background: 'var(--secondary)' }}>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="stat-value">{totalProducts}</div>
            <div className="stat-label">Products</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-box" style={{ background: '#0d8a5f' }}>
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="stat-value">₹{totalSales}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-box" style={{ background: 'var(--primary)' }}>
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="stat-value">{totalOrders} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({pendingOrders} pend)</span></div>
            <div className="stat-label">Orders</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-box" style={{ background: '#8b5cf6' }}>
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="stat-value">{totalReviews}</div>
            <div className="stat-label">Reviews</div>
          </div>
        </div>
      </div>

      {/* Main Form/Grid */}
      <div className="admin-grid">
        
        {/* Left Column: Add / Edit Form */}
        <div className="glass-panel admin-form-panel">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: editingProduct ? 'var(--primary)' : 'var(--secondary)' }}>
            <PlusCircle className="w-4.5 h-4.5" />
            {editingProduct ? 'Edit Product Details' : 'Publish New Product'}
          </h3>

          {formError && (
            <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '12px', background: 'var(--danger-light)', padding: '6px 10px', borderRadius: '6px', fontWeight: 600 }}>
              {formError}
            </div>
          )}
          {formSuccess && (
            <div style={{ color: 'var(--success)', fontSize: '0.8rem', marginBottom: '12px', background: 'var(--success-light)', padding: '6px 10px', borderRadius: '6px', fontWeight: 600 }}>
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sourdough Loaf"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ borderRadius: '8px', padding: '8px 12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                    Category
                  </label>
                  <select
                    className="input-field"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '8px', padding: '8px 12px', height: '39px' }}
                  >
                    {categories.filter(c => c !== 'All Items').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="INR"
                    className="input-field"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ borderRadius: '8px', padding: '8px 12px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                    Stock Level
                  </label>
                  <input
                    type="number"
                    placeholder="Quantity"
                    className="input-field"
                    value={inStock}
                    onChange={(e) => setInStock(e.target.value)}
                    style={{ borderRadius: '8px', padding: '8px 12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                    Active Icon/Emoji
                  </label>
                  <input
                    type="text"
                    placeholder="Emoji representation"
                    className="input-field"
                    value={isBase64Image ? '[Uploaded Image File]' : image}
                    onChange={(e) => {
                      if (!isBase64Image) setImage(e.target.value);
                    }}
                    disabled={isBase64Image}
                    style={{ borderRadius: '8px', padding: '8px 12px', textAlign: 'center', fontWeight: 'bold' }}
                  />
                </div>
              </div>

              {/* Upload image area */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Product Image File Upload
                </label>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                  {/* File selector input */}
                  <label 
                    htmlFor="admin-image-upload" 
                    className="btn-secondary"
                    style={{ borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload JPG/PNG</span>
                  </label>
                  <input
                    type="file"
                    id="admin-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />

                  {/* Remove custom uploaded image */}
                  {isBase64Image && (
                    <button
                      type="button"
                      onClick={() => setImage('🍎')}
                      className="btn-danger"
                      style={{ padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Clear Photo</span>
                    </button>
                  )}
                </div>

                {/* Show Preview box */}
                <div style={{ border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px', marginTop: '10px', background: 'var(--bg-card-sec)' }}>
                  {isBase64Image ? (
                    <img 
                      src={image} 
                      alt="Upload preview" 
                      style={{ maxWidth: '100%', maxHeight: '90px', objectFit: 'contain' }}
                    />
                  ) : (
                    <span style={{ fontSize: '3rem' }}>{image || '📦'}</span>
                  )}
                </div>
              </div>

              {/* Preset Emoji Picker */}
              {!isBase64Image && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                    Quick Preset Emojis
                  </label>
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '8px', border: '1px dashed var(--border-color)', borderRadius: '8px', background: 'var(--bg-card-sec)' }}>
                    {PRESET_IMAGES.map((pImg, idx) => (
                      <span
                        key={idx}
                        onClick={() => setImage(pImg.url)}
                        style={{ fontSize: '1.4rem', cursor: 'pointer', padding: '4px', borderRadius: '4px', border: image === pImg.url ? '2px solid var(--primary)' : '1px solid transparent', background: image === pImg.url ? 'var(--primary-light)' : 'transparent', minWidth: '32px', textAlign: 'center', display: 'inline-block' }}
                        title={pImg.name}
                      >
                        {pImg.url}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Description
                </label>
                <textarea
                  placeholder="Details about quality, weight, metrics..."
                  className="input-field"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ minHeight: '60px', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary" style={{ flexGrow: 1, padding: '10px', borderRadius: '8px' }}>
                  <PlusCircle className="w-4.5 h-4.5" />
                  <span>{editingProduct ? 'Save Updates' : 'Publish Product'}</span>
                </button>
                {editingProduct && (
                  <button 
                    type="button" 
                    onClick={handleCancelEdit} 
                    className="btn-secondary"
                    style={{ padding: '10px', borderRadius: '8px' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Manage Catalog Lists */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Table Search and List */}
          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--bg-nav)' }}>Catalog Manager ({totalProducts})</h3>
              
              <div style={{ position: 'relative', width: '180px' }}>
                <input
                  type="text"
                  placeholder="Search table..."
                  className="input-field"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  style={{ padding: '6px 12px 6px 30px', fontSize: '0.8rem', borderRadius: '6px' }}
                />
                <Search className="absolute text-gray-400 w-3.5 h-3.5" style={{ left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="admin-table-wrapper">
              {filteredProducts.length === 0 ? (
                <div className="no-items-state" style={{ padding: '16px' }}>
                  No catalog items found.
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Icon/Pic</th>
                      <th>Product Name</th>
                      <th>Stock</th>
                      <th>Price</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="admin-table-img">
                            {p.image && p.image.startsWith('data:') ? (
                              <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : p.image || '📦'}
                          </div>
                        </td>
                        <td>
                          <div className="admin-product-name">{p.name}</div>
                          <div className="admin-product-cat">{p.category}</div>
                        </td>
                        <td style={{ fontWeight: 600, color: p.inStock === 0 ? 'var(--danger)' : 'var(--text-secondary)' }}>
                          {p.inStock} units
                        </td>
                        <td style={{ fontWeight: 700 }}>₹{p.price}</td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button 
                              onClick={() => handleStartEdit(p)}
                              className="btn-secondary"
                              style={{ padding: '4px 8px', borderRadius: '6px' }}
                              title="Edit Product"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => onDeleteProduct(p.id)}
                              className="btn-danger"
                              style={{ padding: '4px 8px', borderRadius: '6px' }}
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile Stacked Card View */}
            <div className="admin-stacked-cards">
              {filteredProducts.length === 0 ? (
                <div className="no-items-state" style={{ padding: '16px' }}>
                  No items matched.
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <div key={p.id} className="admin-stacked-card animate-fade-in">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="admin-table-img" style={{ width: '40px', height: '40px' }}>
                        {p.image && p.image.startsWith('data:') ? (
                          <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : p.image || '📦'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.category} • ₹{p.price}</div>
                        <div style={{ fontSize: '0.72rem', color: p.inStock === 0 ? 'var(--danger)' : 'var(--text-secondary)' }}>
                          Stock: {p.inStock} units
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        onClick={() => handleStartEdit(p)}
                        className="btn-secondary"
                        style={{ padding: '6px', borderRadius: '6px' }}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => onDeleteProduct(p.id)}
                        className="btn-danger"
                        style={{ padding: '6px', borderRadius: '6px' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Manage Orders Board */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: 'var(--bg-nav)' }}>Customer Orders ({orders.length})</h3>

            {orders.length === 0 ? (
              <div className="no-items-state" style={{ padding: '16px' }}>
                No customer orders placed yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {orders.map((order) => (
                  <div key={order.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', background: 'var(--bg-card-sec)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                      <div>
                        <strong style={{ fontSize: '0.85rem' }}>{order.orderId}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>{order.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="btn-secondary"
                          style={{ padding: '2px 8px', fontSize: '0.72rem', borderRadius: '4px', height: '24px' }}
                        >
                          Invoice
                        </button>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status: </span>
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                          className="input-field"
                          style={{ display: 'inline-block', width: 'fit-content', padding: '2px 4px', fontSize: '0.75rem', height: 'auto', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginLeft: '4px', borderRadius: '4px' }}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <div>
                        <div>Customer: <strong>{order.shippingDetails.customerName}</strong> ({order.shippingDetails.customerPhone})</div>
                        <div style={{ fontSize: '0.75rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span>Address: {order.shippingDetails.customerAddress}</span>
                          {order.shippingDetails.deliveryType === 'takeaway' && (
                            <span className="badge badge-indigo" style={{ padding: '2px 6px', fontSize: '0.6rem', height: 'auto', verticalAlign: 'middle', borderRadius: '4px' }}>Takeaway</span>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div>Total: <strong>₹{order.shippingDetails.total}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({order.items.length} items)</div>
                      </div>
                    </div>
                    
                    {/* Ordered Items list to Pack */}
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--border-color)', color: 'var(--text-primary)' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px', letterSpacing: '0.04em' }}>Items to Pack:</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '2px 0' }}>
                            <span>
                              <strong style={{ color: 'var(--bg-nav)' }}>{item.name}</strong> 
                              <span style={{ color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 650 }}>x{item.quantity}</span>
                            </span>
                            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

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
