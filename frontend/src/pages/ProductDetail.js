import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Mail } from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import ProductCard from '../components/ProductCard';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
    fetchSuggestedProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
      if (response.data.sizes.length > 0) {
        setSelectedSize(response.data.sizes[0]);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setSuggestedProducts(response.data.filter(p => p.id !== id).slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch suggested products:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    try {
      await addToCart(product.id, selectedSize, 1);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }
    try {
      if (isInWishlist(product.id)) {
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

  const handleContactForOrder = () => {
    if (!isAuthenticated) {
      toast.error('Please login to submit enquiry');
      navigate('/login');
      return;
    }
    navigate('/contact', { state: { productId: product.id, productName: product.name } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen py-16 md:py-24" data-testid="product-detail-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div className="space-y-4">
            <div className="aspect-[3/4] overflow-hidden bg-secondary/20" data-testid="product-main-image">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden bg-secondary/20">
                    <img src={image} alt={`${product.name} ${index + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2" data-testid="product-category">
                {product.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4" data-testid="product-name">
                {product.name}
              </h1>
              <p className="text-2xl font-light mb-6" data-testid="product-price">${product.price.toFixed(2)}</p>
            </div>

            <div className="border-t border-border pt-6">
              <p className="text-base font-light leading-relaxed text-muted-foreground" data-testid="product-description">
                {product.description}
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-widest mb-3">Select Size</label>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border transition-colors ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      }`}
                      data-testid={`size-option-${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${product.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm" data-testid="product-availability">
                    {product.availability ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={!product.availability}
                className="w-full h-12 rounded-none uppercase tracking-widest text-xs"
                data-testid="add-to-cart-button"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleWishlistToggle}
                variant="outline"
                className="w-full h-12 rounded-none uppercase tracking-widest text-xs"
                data-testid="add-to-wishlist-button"
              >
                <Heart className={`w-4 h-4 mr-2 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
              <Button
                onClick={handleContactForOrder}
                variant="outline"
                className="w-full h-12 rounded-none uppercase tracking-widest text-xs"
                data-testid="contact-for-order-button"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact for Details & Order
              </Button>
            </div>
          </div>
        </div>

        {suggestedProducts.length > 0 && (
          <div data-testid="suggested-products">
            <h2 className="text-3xl font-serif tracking-tight mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {suggestedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;