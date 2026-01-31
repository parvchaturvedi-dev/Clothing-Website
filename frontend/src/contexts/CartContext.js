import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API}/cart`);
      setCart(response.data.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`${API}/wishlist`);
      setWishlist(response.data || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  const addToCart = async (productId, size, quantity = 1) => {
    try {
      await axios.post(`${API}/cart/add`, { product_id: productId, size, quantity });
      await fetchCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const updateCart = async (productId, size, quantity) => {
    try {
      await axios.put(`${API}/cart/update`, { product_id: productId, size, quantity });
      await fetchCart();
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId, size) => {
    try {
      await axios.delete(`${API}/cart/remove/${productId}?size=${size}`);
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await axios.post(`${API}/wishlist/add`, { product_id: productId });
      await fetchWishlist();
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`${API}/wishlist/remove/${productId}`);
      await fetchWishlist();
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      throw error;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      addToCart,
      updateCart,
      removeFromCart,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      refreshCart: fetchCart,
      refreshWishlist: fetchWishlist
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};