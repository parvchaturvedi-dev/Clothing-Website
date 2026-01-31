import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border/40 py-16 md:py-24" data-testid="footer">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-serif mb-4">LUXE</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium fashion for those who appreciate timeless elegance and sophisticated style.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-medium mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-products">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-collections">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-medium mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-medium mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 h-12 px-4 border border-border bg-transparent text-sm focus:outline-none focus:border-primary transition-colors"
                data-testid="newsletter-input"
              />
              <button className="h-12 px-6 bg-primary text-primary-foreground text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors" data-testid="newsletter-submit">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground tracking-widest">
            © 2024 LUXE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;