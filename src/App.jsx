import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import Orders from './components/Orders';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import { ShoppingBag, Info, AlertTriangle, Search } from 'lucide-react';

const CATEGORIES = [
  'All Items',
  'Produce',
  'Dairy',
  'Bakery',
  'Pantry',
  'Beverages',
  'Snacks'
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Apple',
    category: 'Produce',
    price: 90,
    image: '🍎',
    inStock: 49,
    description: 'Fresh premium orchard red apples. Crispy, sweet, juicy, and rich in natural dietary fiber and Vitamin C.',
    reviews: [
      { id: 101, author: 'Amit K.', rating: 5, comment: 'Extremely fresh and crunchy!', date: 'Jun 10, 2026' }
    ]
  },
  {
    id: 2,
    name: 'Carrot',
    category: 'Produce',
    price: 60,
    image: '🥕',
    inStock: 59,
    description: 'Crisp organic orange carrots harvested fresh from local fields. Ideal for salads, juices, and cooking.',
    reviews: []
  },
  {
    id: 3,
    name: 'Banana',
    category: 'Produce',
    price: 40,
    image: '🍌',
    inStock: 80,
    description: 'Perfectly ripe bananas. Packed with potassium, natural sugars, and quick energy. Great for smoothies.',
    reviews: []
  },
  {
    id: 4,
    name: 'Avocado',
    category: 'Produce',
    price: 150,
    image: '🥑',
    inStock: 25,
    description: 'Smooth and buttery Hass avocados. Excellent source of healthy monounsaturated fats. Ready to eat.',
    reviews: []
  },
  {
    id: 5,
    name: 'Milk (1L)',
    category: 'Dairy',
    price: 75,
    image: '🥛',
    inStock: 40,
    description: 'Fresh farm-sourced pasteurized whole cream milk. High in calcium, protein, and nutrients.',
    reviews: [
      { id: 102, author: 'Ramesh P.', rating: 5, comment: 'Rich cream content, perfect for my morning chai!', date: 'Jun 14, 2026' }
    ]
  },
  {
    id: 6,
    name: 'Cheddar Cheese',
    category: 'Dairy',
    price: 250,
    image: '🧀',
    inStock: 15,
    description: 'Rich, sharp cheddar cheese blocks. Aged to perfection, offering a savory profile for sandwiches and pairings.',
    reviews: []
  },
  {
    id: 7,
    name: 'Butter',
    category: 'Dairy',
    price: 120,
    image: '🧈',
    inStock: 30,
    description: 'Pure salted creamery table butter. Made from fresh milk, perfect for spreading and baking.',
    reviews: []
  },
  {
    id: 8,
    name: 'Bread Loaf',
    category: 'Bakery',
    price: 45,
    image: '🍞',
    inStock: 50,
    description: 'Freshly baked soft white sandwich bread. Sliced and ready for toasting, making sandwiches, or French toast.',
    reviews: []
  },
  {
    id: 9,
    name: 'Chilled Cola',
    category: 'Beverages',
    price: 50,
    image: '🥤',
    inStock: 60,
    description: 'Sparkling refreshing cola drink with natural citrus notes and botanical extracts. Best served chilled.',
    reviews: [
      { id: 103, author: 'Nisha M.', rating: 5, comment: 'Extremely fizzy and refreshing!', date: 'Jun 16, 2026' }
    ]
  },
  {
    id: 10,
    name: 'Classic Potato Chips',
    category: 'Snacks',
    price: 40,
    image: '🍟',
    inStock: 45,
    description: 'Crispy salted golden potato chips. Kettle-cooked to guarantee a satisfying crunch in every bite.',
    reviews: []
  },
  {
    id: 11,
    name: 'Herbal Toilet Soap',
    category: 'Pantry',
    price: 90,
    image: '🧼',
    inStock: 20,
    description: 'Soothing aloe vera and neem oil organic soap bar. Moisturizes dry skin and maintains freshness.',
    reviews: []
  },
  {
    id: 12,
    name: 'Liquid Detergent',
    category: 'Pantry',
    price: 299,
    image: '🧴',
    inStock: 15,
    description: 'Concentrated eco-friendly liquid laundry detergent. Removes tough stains and preserves fabric colors.',
    reviews: []
  }
];

export default function App() {
  // Theme & Session States
  const [theme, setTheme] = useState(() => localStorage.getItem('ss_theme') || 'light');
  
  // User Authentication
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ss_session_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('ss_session_token') || '');

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Navigation Tabs
  const [currentTab, setCurrentTab] = useState('shop');
  
  // Products and Orders
  const [products, setProducts] = useState([]);
  
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('ss_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState([]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Notifications State
  const [toasts, setToasts] = useState([]);

  // Fetch initial catalog of products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          setProducts(INITIAL_PRODUCTS);
          addToast("Backend server offline. Displaying demo catalog.", "warning");
        }
      } catch (err) {
        console.error("Failed to load products", err);
        setProducts(INITIAL_PRODUCTS);
        addToast("Backend server offline. Displaying demo catalog.", "warning");
      }
    };
    fetchProducts();
  }, []);

  // Fetch user or admin orders when logged in user or token changes
  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser || !token) {
        setOrders([]);
        return;
      }
      try {
        const url = currentUser.role === 'admin' 
          ? '/api/orders' 
          : `/api/orders/user/${currentUser.email}`;
        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to load orders", err);
      }
    };
    fetchOrders();
  }, [currentUser, token]);

  // Load Google GSI OAuth Library dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "174417877225-19usi9ac90q9nqrfdn9oo4scioum4oqg.apps.googleusercontent.com",
          callback: handleGoogleCredentialResponse
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {
        // ignore
      }
    };
  }, []);

  // Sync state to local storage (Only cart, theme, user session, and auth token)
  useEffect(() => {
    localStorage.setItem('ss_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ss_session_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ss_session_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('ss_session_token', token);
    } else {
      localStorage.removeItem('ss_session_token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('ss_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toast helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Google GSI ID JWT Credential parser
  const handleGoogleCredentialResponse = (response) => {
    if (response && response.credential) {
      handleGoogleLogin(response.credential);
    }
  };

  // Google Login session trigger via secure backend verification
  const handleGoogleLogin = async (credential) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Google authentication failed.', 'danger');
        return;
      }
      setCurrentUser({ ...data.user, isGoogle: true });
      setToken(data.token);
      addToast(`Signed in with Google as ${data.user.name}`, 'success');
      setCurrentTab('shop');
    } catch (err) {
      console.error("Google login connection error:", err);
      addToast('Connection error. Google authentication failed.', 'danger');
    }
  };

  // Theme Toggle
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    addToast(`Switched to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, 'info');
  };

  // Credentials Login
  const handleLogin = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Invalid email or password.', 'danger');
        return false;
      }
      setCurrentUser(data.user);
      setToken(data.token);
      addToast(`Logged in as ${data.user.name}`, 'success');
      if (data.user.role === 'admin') {
        setCurrentTab('admin');
      } else {
        setCurrentTab('shop');
      }
      return true;
    } catch (err) {
      console.error(err);
      addToast('Connection error. Server may be offline.', 'danger');
      return false;
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Registration failed.' };
      }
      setCurrentUser(data.user);
      setToken(data.token);
      addToast(`Account created! Welcome, ${data.user.name}`, 'success');
      setCurrentTab('shop');
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Connection error. Server may be offline.' };
    }
  };

  const handleLogout = () => {
    addToast('Logged out successfully', 'warning');
    setCurrentUser(null);
    setToken('');
    setCurrentTab('shop');
  };

  const handleUpdateProfile = async (updatedDetails) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: updatedDetails.name,
          photo: updatedDetails.photo,
          password: updatedDetails.password
        })
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Failed to update profile.', 'danger');
        return;
      }
      setCurrentUser(data);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Connection error. Failed to update profile.', 'danger');
    }
  };

  // Role toggle callback from Navbar (Staff Door)
  const handleToggleRole = () => {
    if (currentUser && currentUser.role === 'admin') {
      setCurrentTab((prev) => (prev === 'admin' ? 'shop' : 'admin'));
    } else {
      setShowAuthModal(true);
      addToast('Please login as administrator to enter the Staff Door.', 'info');
    }
  };

  // Add Item to Cart
  const handleAddToCart = (product) => {
    const dbProduct = products.find(p => p.id === product.id);
    if (!dbProduct) return;

    const availableStock = dbProduct.inStock;
    if (availableStock <= 0) {
      addToast(`Out of Stock: ${product.name} is currently unavailable.`, 'danger');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= availableStock) {
          addToast(`Limit Reached: Only ${availableStock} units of ${product.name} are in stock.`, 'warning');
          return prevCart;
        }
        addToast(`Added another ${product.name} to cart`, 'success');
        setIsCartOpen(true);
        return prevCart.map((item) => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        addToast(`${product.name} added to cart`, 'success');
        setIsCartOpen(true);
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Update Cart Quantity
  const handleUpdateCartQty = (productId, qty) => {
    if (qty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }

    const dbProduct = products.find(p => p.id === productId);
    if (!dbProduct) return;

    const availableStock = dbProduct.inStock;
    if (qty > availableStock) {
      addToast(`Limit Reached: Only ${availableStock} units of ${dbProduct.name} in stock.`, 'warning');
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === productId ? { ...item, quantity: availableStock } : item))
      );
      return;
    }

    setCart((prevCart) => 
      prevCart.map((item) => (item.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  // Remove Item from Cart
  const handleRemoveCartItem = (productId) => {
    const item = cart.find(c => c.id === productId);
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    if (item) {
      addToast(`Removed ${item.name} from cart`, 'warning');
    }
  };

  // Checkout process (updates stock level in products DB)
  const handleCheckout = async (shippingDetails) => {
    const orderId = `#ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrderPayload = {
      orderId,
      date: new Date().toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      shippingDetails,
      status: 'Processing'
    };

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(newOrderPayload)
      });
      if (res.ok) {
        const orderData = await res.json();
        setOrders((prevOrders) => [orderData, ...prevOrders]);
        setCart([]);
        addToast('Checkout simulated! Your order was placed.', 'success');

        // Refetch products to get updated stock levels
        const productsRes = await fetch('/api/products');
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }
      } else {
        addToast("Checkout failed. Please try again.", "danger");
      }
    } catch (err) {
      console.error(err);
      addToast("Connection error. Failed to place order.", "danger");
    }
  };

  // Admin CRUD Add Product
  const handleAddProduct = async (newProduct) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        const data = await res.json();
        setProducts((prev) => [data, ...prev]);
        addToast(`Product "${data.name}" published!`, 'success');
      } else {
        addToast("Failed to publish product.", "danger");
      }
    } catch (err) {
      console.error(err);
      addToast("Connection error. Failed to add product.", "danger");
    }
  };

  // Admin CRUD Update Product
  const handleUpdateProduct = async (productId, updatedProduct) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProduct)
      });
      if (res.ok) {
        const data = await res.json();
        setProducts((prev) => 
          prev.map((product) => product.id === productId ? data : product)
        );
        setCart((prevCart) => 
          prevCart.map((item) => item.id === productId ? { ...item, ...data, quantity: item.quantity } : item)
        );
        addToast(`Product "${data.name}" saved!`, 'success');
      } else {
        addToast("Failed to update product.", "danger");
      }
    } catch (err) {
      console.error(err);
      addToast("Connection error. Failed to update product.", "danger");
    }
  };

  // Admin CRUD Delete Product
  const handleDeleteProduct = async (productId) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const p = products.find(prod => prod.id === productId);
        setProducts((prev) => prev.filter((product) => product.id !== productId));
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
        addToast(`Product "${p ? p.name : ''}" deleted from catalog`, 'danger');
      } else {
        addToast("Failed to delete product.", "danger");
      }
    } catch (err) {
      console.error(err);
      addToast("Connection error. Failed to delete product.", "danger");
    }
  };

  // Admin updating order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders((prevOrders) => 
          prevOrders.map((order) => order.id === orderId ? updatedOrder : order)
        );
        addToast(`Order status updated to "${newStatus}"`, 'info');
      } else {
        addToast("Failed to update order status.", "danger");
      }
    } catch (err) {
      console.error(err);
      addToast("Connection error. Failed to update status.", "danger");
    }
  };

  // Add review to product
  const handleAddReview = async (productId, review) => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      if (res.ok) {
        const updatedProduct = await res.json();
        setProducts((prevProducts) => 
          prevProducts.map((p) => p.id === productId ? updatedProduct : p)
        );
        setSelectedProduct(updatedProduct);
        addToast('Review submitted. Thank you for your feedback!', 'success');
      } else {
        addToast("Failed to submit review.", "danger");
      }
    } catch (err) {
      console.error(err);
      addToast("Connection error. Failed to submit review.", "danger");
    }
  };

  // Filtering products for User view
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All Items' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation bar */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onOpenCart={() => setIsCartOpen(true)}
        toggleRole={handleToggleRole}
        onOpenProfile={() => setShowProfileModal(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main page content area */}
      <main className="container main-content" style={{ flexGrow: 1 }}>
        
        {/* SHOP TAB */}
        {currentTab === 'shop' && (
          <div>
            {/* Catalog Search Input placed in body as in screenshot */}
            <div className="catalog-search-wrapper animate-fade-in">
              <input
                type="text"
                placeholder="Search products..."
                className="input-field catalog-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute text-gray-400 w-5 h-5" style={{ right: '18px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {/* Category tabs */}
            <div className="categories-container">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Catalog Grid */}
            {filteredProducts.length === 0 ? (
              <div className="glass-panel no-items-state">
                <ShoppingBag className="no-items-icon" style={{ width: '56px', height: '56px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Products Match Your Criteria</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try refining your search terms or selecting a different category.</p>
              </div>
            ) : (
              <div className="grid-products">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onOpenDetails={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS HISTORY TAB */}
        {currentTab === 'orders' && (
          <Orders 
            orders={orders} 
            setCurrentTab={setCurrentTab}
            currentUser={currentUser}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}

        {/* ADMIN TAB */}
        {currentTab === 'admin' && currentUser && currentUser.role === 'admin' && (
          <AdminPanel 
            products={products}
            orders={orders}
            categories={CATEGORIES}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </main>

      {/* Detail Modal Overlay */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onAddReview={handleAddReview}
          currentUser={currentUser}
          onOpenAuth={() => setShowAuthModal(true)}
        />
      )}

      {/* Cart Drawer Component */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
        currentUser={currentUser}
        onOpenAuth={() => { setIsCartOpen(false); setShowAuthModal(true); }}
      />

      {/* Login / Register Authentication Modal Overlay */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onGoogleLogin={handleGoogleLogin}
        />
      )}

      {/* User Profile Modal Overlay */}
      {showProfileModal && (
        <UserProfileModal 
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          currentUser={currentUser}
          onUpdateProfile={handleUpdateProfile}
          addToast={addToast}
        />
      )}

      {/* Toast Alert System Overlay */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.type === 'success' && <CheckCircle className="w-5 h-5" style={{ color: 'var(--success)', flexShrink: 0 }} />}
            {toast.type === 'info' && <Info className="w-5 h-5" style={{ color: 'var(--bg-nav)', flexShrink: 0 }} />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" style={{ color: 'var(--warning)', flexShrink: 0 }} />}
            {toast.type === 'danger' && <AlertTriangle className="w-5 h-5" style={{ color: 'var(--danger)', flexShrink: 0 }} />}
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{toast.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

// Inline fallback CheckCircle SVG icon component
function CheckCircle({ className, style }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      style={style}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}
