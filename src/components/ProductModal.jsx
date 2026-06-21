import React, { useState, useEffect } from 'react';
import { X, Star, MessageSquare, Send } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart, onAddReview, currentUser, onOpenAuth }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-fill reviewer name if user is logged in
  useEffect(() => {
    if (currentUser) {
      setAuthorName(currentUser.name);
    } else {
      setAuthorName('');
    }
  }, [currentUser]);

  const getAverageRating = (reviews = []) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const avgRating = getAverageRating(product.reviews);
  const reviewsCount = product.reviews ? product.reviews.length : 0;
  const inStock = product.inStock !== undefined ? product.inStock : 50;

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!authorName.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!reviewText.trim()) {
      setErrorMsg('Please enter your review comments.');
      return;
    }

    onAddReview(product.id, {
      id: Date.now(),
      author: authorName.trim(),
      avatar: currentUser ? currentUser.photo : null, // Record Google profile avatar if logged in
      rating,
      comment: reviewText.trim(),
      date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    });

    setReviewText('');
    setRating(5);
  };

  // Check if image is standard image URL or Base64 string
  const isImageString = product.image && (product.image.startsWith('data:') || product.image.startsWith('http') || product.image.startsWith('/'));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>

        <div className="modal-grid">
          {/* Left Column: Image / Emoji */}
          <div className="modal-img-wrapper">
            {isImageString ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="modal-img-content"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <span className="product-media-emoji">
                {product.image || '📦'}
              </span>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="modal-info-panel">
            <span className="badge badge-indigo" style={{ width: 'fit-content' }}>
              {product.category}
            </span>
            <h2 className="modal-title">{product.name}</h2>

            {/* Average Rating Star Breakdown */}
            <div className="product-card-rating" style={{ marginBottom: '8px' }}>
              <div className="product-card-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < Math.round(avgRating) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {avgRating} ({reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <div className="modal-price-tag">
              <span style={{ fontSize: '1rem', color: 'var(--primary)', marginRight: '2px' }}>₹</span>
              {product.price}
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              {inStock > 0 ? (
                `${inStock} units in stock`
              ) : (
                <span style={{ color: 'var(--danger)', fontWeight: 700 }}>Out of stock</span>
              )}
            </div>

            <p className="modal-desc">{product.description}</p>

            <button 
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="product-card-btn-buy"
              style={{ padding: '12px', marginTop: 'auto', borderRadius: '8px' }}
              disabled={inStock <= 0}
            >
              Add to cart
            </button>
          </div>
        </div>

        {/* Reviews List Section */}
        <div className="reviews-section-title">
          <span>Customer Reviews</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {reviewsCount} Shared Thoughts
          </span>
        </div>

        <div className="reviews-list">
          {reviewsCount === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>
              <MessageSquare className="w-8 h-8 text-gray-400" style={{ margin: '0 auto 8px auto', display: 'block' }} />
              No reviews yet for this product. Be the first to review!
            </div>
          ) : (
            product.reviews.map((rev) => (
              <div key={rev.id} className="review-card animate-fade-in">
                <div className="review-card-header">
                  <div className="review-author-box">
                    {rev.avatar ? (
                      <img src={rev.avatar} alt={rev.author} className="review-avatar-img" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="review-avatar-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--border-color)', color: 'var(--text-primary)', fontSize: '0.65rem', fontWeight: 'bold' }}>
                        {rev.author.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="review-author">{rev.author}</span>
                  </div>
                  <span className="review-date">{rev.date}</span>
                </div>
                <div className="product-card-stars" style={{ marginBottom: '6px', color: '#d97706' }}>
                  {[...Array(5)].map((_, idx) => (
                    <span key={idx}>
                      {idx < rev.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <p className="review-text">{rev.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Write a Review Section (available to both guests and logged-in users) */}
        <div className="review-form-panel">
          <h4 className="review-form-title">Write a Customer Review</h4>
          
          {errorMsg && (
            <div style={{ color: 'var(--danger)', fontSize: '0.82rem', marginBottom: '12px', fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmitReview}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Your Name {currentUser && <span style={{ color: 'var(--success)' }}>(Pre-filled)</span>}
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="input-field"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  style={{ borderRadius: '8px', padding: '10px 14px' }}
                  disabled={!!currentUser} // Freeze input if user is logged in
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Rating
                </label>
                <div className="review-rating-select">
                  <div className="stars interactive">
                    {[...Array(5)].map((_, i) => {
                      const ratingVal = i + 1;
                      return (
                        <span 
                          key={i} 
                          onClick={() => setRating(ratingVal)}
                          onMouseEnter={() => setHoverRating(ratingVal)}
                          onMouseLeave={() => setHoverRating(0)}
                          style={{ fontSize: '1.4rem', cursor: 'pointer', color: '#d97706', transition: 'transform 0.1s ease', display: 'inline-block' }}
                        >
                          {(hoverRating || rating) >= ratingVal ? '★' : '☆'}
                        </span>
                      );
                    })}
                  </div>
                  <span className="review-rating-label" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>({rating} Stars)</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase' }}>
                Review Comments
              </label>
              <textarea
                placeholder="What did you like or dislike about this product?"
                className="input-field"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '8px 16px', borderRadius: '8px' }}>
              <Send className="w-4 h-4" />
              <span>Submit Review</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
