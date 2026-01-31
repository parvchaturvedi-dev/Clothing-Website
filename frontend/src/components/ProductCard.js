import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const ProductCard = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { isAuthenticated } = useAuth();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }
    
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product.id);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block animate-fade-in"
      data-testid={`product-card-${product.id}`}
    >
      <div className="relative overflow-hidden bg-secondary/20 aspect-[3/4] mb-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          data-testid="product-image"
        />
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          data-testid="wishlist-toggle"
        >
          <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
        {!product.availability && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white py-2 px-4 text-xs uppercase tracking-widest text-center">
            Out of Stock
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground" data-testid="product-category">
          {product.category}
        </p>
        <h3 className="text-base font-light" data-testid="product-name">{product.name}</h3>
        <p className="text-sm font-medium" data-testid="product-price">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;