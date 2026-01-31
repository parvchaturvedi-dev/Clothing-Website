import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length > 0) {
      fetchWishlistProducts();
    } else {
      setLoading(false);
    }
  }, [wishlist]);

  const fetchWishlistProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      const wishlistProducts = response.data.filter(p => wishlist.includes(p.id));
      setProducts(wishlistProducts);
    } catch (error) {
      console.error('Failed to fetch wishlist products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toast.success('Removed from wishlist');
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 md:py-24" data-testid="wishlist-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-2" data-testid="wishlist-title">
            My Wishlist
          </h1>
          <p className="text-sm text-muted-foreground">{products.length} items saved</p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6" data-testid="wishlist-items">
            {products.map((product) => (
              <div key={product.id} className="flex gap-6 p-6 border border-border" data-testid={`wishlist-item-${product.id}`}>
                <Link to={`/products/${product.id}`} className="w-32 h-40 overflow-hidden bg-secondary/20 flex-shrink-0">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1">
                  <Link to={`/products/${product.id}`}>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{product.category}</p>
                    <h3 className="text-lg font-serif mb-2">{product.name}</h3>
                    <p className="text-base font-medium mb-3">${product.price.toFixed(2)}</p>
                  </Link>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${product.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">{product.availability ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(product.id)}
                  className="self-start hover:text-destructive transition-colors"
                  data-testid={`remove-wishlist-${product.id}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24" data-testid="empty-wishlist">
            <p className="text-lg text-muted-foreground mb-6">Your wishlist is empty</p>
            <Link to="/products">
              <Button className="h-12 px-8 rounded-none uppercase tracking-widest text-xs">
                Explore Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;