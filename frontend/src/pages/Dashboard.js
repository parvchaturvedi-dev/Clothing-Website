import React, { useEffect, useState } from 'react';
import { User, Heart, ShoppingCart, Mail } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Dashboard = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get(`${API}/enquiry`);
      setEnquiries(response.data);
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 md:py-24" data-testid="dashboard-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-2" data-testid="dashboard-title">
            My Account
          </h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/wishlist" className="p-6 border border-border hover:border-primary transition-colors" data-testid="wishlist-card">
            <Heart className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-serif mb-2">Wishlist</h3>
            <p className="text-sm text-muted-foreground">View your saved items</p>
          </Link>

          <Link to="/cart" className="p-6 border border-border hover:border-primary transition-colors" data-testid="cart-card">
            <ShoppingCart className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-serif mb-2">Shopping Cart</h3>
            <p className="text-sm text-muted-foreground">Review your cart items</p>
          </Link>

          <Link to="/contact" className="p-6 border border-border hover:border-primary transition-colors" data-testid="enquiry-card">
            <Mail className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-serif mb-2">New Enquiry</h3>
            <p className="text-sm text-muted-foreground">Submit a new enquiry</p>
          </Link>
        </div>

        <div className="mb-12">
          <div className="bg-secondary/20 p-6">
            <div className="flex items-center space-x-4 mb-4">
              <User className="w-12 h-12" />
              <div>
                <h2 className="text-2xl font-serif">Profile Information</h2>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span> <span className="ml-2" data-testid="user-name">{user?.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span> <span className="ml-2" data-testid="user-email">{user?.email}</span>
              </div>
              {user?.phone && (
                <div>
                  <span className="text-muted-foreground">Phone:</span> <span className="ml-2" data-testid="user-phone">{user.phone}</span>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Login Count:</span> <span className="ml-2" data-testid="login-count">{user?.login_count}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-serif mb-6">My Enquiries</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading enquiries...</p>
            </div>
          ) : enquiries.length > 0 ? (
            <div className="space-y-4" data-testid="enquiries-list">
              {enquiries.map((enquiry) => (
                <div key={enquiry.id} className="p-6 border border-border" data-testid={`enquiry-${enquiry.id}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        {new Date(enquiry.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <span className={`inline-block px-3 py-1 text-xs uppercase tracking-widest ${
                        enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {enquiry.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm">{enquiry.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12" data-testid="no-enquiries">
              <p className="text-muted-foreground">You haven't submitted any enquiries yet.</p>
              <Link to="/contact" className="text-sm underline mt-2 inline-block">Submit your first enquiry</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;