import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Cart = () => {
  const { cart, updateCart, removeFromCart, refreshCart } = useCart();
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartProducts();
  }, [cart]);

  const fetchCartProducts = async () => {
    try {
      if (cart.length > 0) {
        const response = await axios.get(`${API}/products`);
        const productsMap = {};
        response.data.forEach(p => {
          productsMap[p.id] = p;
        });
        setProducts(productsMap);
      }
    } catch (error) {
      console.error('Failed to fetch cart products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCart(item.product_id, item.size, newQuantity);
      await refreshCart();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeFromCart(item.product_id, item.size);
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove from cart');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const product = products[item.product_id];
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleCheckout = () => {
    navigate('/contact', { state: { fromCart: true } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 md:py-24" data-testid="cart-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-2" data-testid="cart-title">
            Shopping Cart
          </h1>
          <p className="text-sm text-muted-foreground">{cart.length} items in cart</p>
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6" data-testid="cart-items">
              {cart.map((item, index) => {
                const product = products[item.product_id];
                if (!product) return null;

                return (
                  <div key={`${item.product_id}-${item.size}-${index}`} className="flex gap-6 p-6 border border-border" data-testid={`cart-item-${item.product_id}`}>
                    <Link to={`/products/${product.id}`} className="w-32 h-40 overflow-hidden bg-secondary/20 flex-shrink-0">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/products/${product.id}`}>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{product.category}</p>
                        <h3 className="text-lg font-serif mb-2">{product.name}</h3>
                        <p className="text-base font-medium mb-2">${product.price.toFixed(2)}</p>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-4">Size: {item.size}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-accent transition-colors"
                            data-testid={`decrease-quantity-${item.product_id}`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center" data-testid={`quantity-${item.product_id}`}>{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-accent transition-colors"
                            data-testid={`increase-quantity-${item.product_id}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item)}
                          className="text-sm hover:text-destructive transition-colors flex items-center"
                          data-testid={`remove-cart-${item.product_id}`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <div className="bg-secondary/20 p-6 sticky top-24" data-testid="cart-summary">
                <h2 className="text-2xl font-serif mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span data-testid="cart-subtotal">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-lg font-medium">
                      <span>Total</span>
                      <span data-testid="cart-total">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 rounded-none uppercase tracking-widest text-xs mb-4"
                  data-testid="checkout-button"
                >
                  Proceed to Enquiry
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Submit an enquiry and our team will contact you to complete your order
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24" data-testid="empty-cart">
            <p className="text-lg text-muted-foreground mb-6">Your cart is empty</p>
            <Link to="/products">
              <Button className="h-12 px-8 rounded-none uppercase tracking-widest text-xs">
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;