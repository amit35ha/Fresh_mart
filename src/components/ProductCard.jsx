import { Leaf, Milk, Cookie, CupSoda, Sparkles, Home, Tag, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onOpenDetails, onAddToCart }) {
  const getAverageRating = (reviews = []) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const avgRating = getAverageRating(product.reviews);
  const reviewsCount = product.reviews ? product.reviews.length : 0;
  const inStock = product.inStock !== undefined ? product.inStock : 50;

  // Category Icon Selector
  const getCategoryIcon = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('fruits') || cat.includes('vegetables') || cat.includes('produce')) {
      return <Leaf className="w-3.5 h-3.5 text-emerald-600" />;
    }
    if (cat.includes('dairy') || cat.includes('bakery')) {
      return <Milk className="w-3.5 h-3.5 text-amber-600" />;
    }
    if (cat.includes('snacks') || cat.includes('sweets') || cat.includes('pantry')) {
      return <Cookie className="w-3.5 h-3.5 text-amber-700" />;
    }
    if (cat.includes('beverages') || cat.includes('drink')) {
      return <CupSoda className="w-3.5 h-3.5 text-blue-600" />;
    }
    if (cat.includes('personal') || cat.includes('care')) {
      return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
    }
    if (cat.includes('household') || cat.includes('clean')) {
      return <Home className="w-3.5 h-3.5 text-indigo-600" />;
    }
    return <Tag className="w-3.5 h-3.5 text-gray-600" />;
  };

  // Check if image is an emoji or standard image url / base64 string
  const isImageString = product.image && (product.image.startsWith('data:') || product.image.startsWith('http') || product.image.startsWith('/'));

  return (
    <div className="product-card animate-fade-in">
      {/* Category header with aligned icon */}
      <div className="product-card-header">
        <span className="product-card-cat-badge">
          {getCategoryIcon(product.category)}
          <span style={{ display: 'inline-block', verticalAlign: 'middle', marginTop: '1px' }}>{product.category}</span>
        </span>
      </div>

      {/* Media container: support base64 images or emojis */}
      <div className="product-media-container">
        {isImageString ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-media-img"
            onError={(e) => {
              // fallback if fails
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <span className="product-media-emoji">
            {product.image || '📦'}
          </span>
        )}
      </div>

      {/* Product Information Details */}
      <div className="product-card-details">
        <h3 className="product-card-title">{product.name}</h3>
        
        <div className="product-card-price">
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>₹</span>
          <span>{product.price}</span>
        </div>

        <div className="product-card-stock">
          {inStock > 0 ? (
            `${inStock} in stock`
          ) : (
            <span style={{ color: 'var(--danger)', fontWeight: 700 }}>Out of stock</span>
          )}
        </div>

        {/* Audit Rating star alignments */}
        <div className="product-card-rating">
          {reviewsCount > 0 ? (
            <>
              <div className="product-card-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignSelf: 'center' }}>
                    {i < Math.round(avgRating) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span style={{ display: 'inline-flex', alignSelf: 'center', lineHeight: 1 }}>
                {avgRating} ({reviewsCount})
              </span>
            </>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>No reviews yet</span>
          )}
        </div>

        {/* Add to Cart button */}
        <button 
          onClick={() => onAddToCart(product)}
          className="product-card-btn-buy"
          disabled={inStock <= 0}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to cart</span>
        </button>

        {/* Reviews and Ratings trigger link */}
        <button 
          onClick={() => onOpenDetails(product)}
          className="product-card-reviews-link"
        >
          Reviews & ratings
        </button>
      </div>
    </div>
  );
}
