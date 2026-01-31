import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Heart, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { cart, wishlist } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/10" data-testid="main-navigation">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-2xl font-serif tracking-tight" data-testid="logo-link">
            LUXE
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm uppercase tracking-widest hover:text-muted-foreground transition-colors" data-testid="nav-home">
              Home
            </Link>
            <Link to="/about" className="text-sm uppercase tracking-widest hover:text-muted-foreground transition-colors" data-testid="nav-about">
              About
            </Link>
            <Link to="/products" className="text-sm uppercase tracking-widest hover:text-muted-foreground transition-colors" data-testid="nav-products">
              Explore
            </Link>
            <Link to="/collections" className="text-sm uppercase tracking-widest hover:text-muted-foreground transition-colors" data-testid="nav-collections">
              Collections
            </Link>
            <Link to="/contact" className="text-sm uppercase tracking-widest hover:text-muted-foreground transition-colors" data-testid="nav-contact">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/wishlist" className="relative" data-testid="wishlist-icon">
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative" data-testid="cart-icon">
                  <ShoppingCart className="w-5 h-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <Button variant="ghost" size="sm" className="rounded-none" data-testid="user-menu-button">
                    <User className="w-5 h-5" />
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-accent" data-testid="dashboard-link">
                      Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-accent" data-testid="admin-link">
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-accent" data-testid="logout-button">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login" data-testid="login-link">
                <Button className="h-10 px-6 rounded-none uppercase tracking-widest text-xs">
                  Login
                </Button>
              </Link>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden" data-testid="mobile-menu-toggle">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2" data-testid="mobile-menu">
            <Link to="/" className="block py-2 text-sm uppercase tracking-widest" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/about" className="block py-2 text-sm uppercase tracking-widest" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link to="/products" className="block py-2 text-sm uppercase tracking-widest" onClick={() => setIsOpen(false)}>
              Explore
            </Link>
            <Link to="/collections" className="block py-2 text-sm uppercase tracking-widest" onClick={() => setIsOpen(false)}>
              Collections
            </Link>
            <Link to="/contact" className="block py-2 text-sm uppercase tracking-widest" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block py-2 text-sm uppercase tracking-widest" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block py-2 text-sm uppercase tracking-widest" onClick={() => setIsOpen(false)}>
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="block py-2 text-sm uppercase tracking-widest text-left w-full">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block py-2 text-sm uppercase tracking-widest" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;