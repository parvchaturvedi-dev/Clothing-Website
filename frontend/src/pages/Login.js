import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        const { register: registerUser } = require('../contexts/AuthContext');
        await registerUser(formData);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error.response?.data?.detail || (isLogin ? 'Login failed' : 'Registration failed');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 md:py-24 flex items-center" data-testid="auth-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4" data-testid="auth-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'Login to access your account' : 'Join LUXE for exclusive access'}
            </p>
          </div>

          <div className="bg-secondary/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="auth-form">
              {!isLogin && (
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full h-12 px-4 border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                    data-testid="name-input"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full h-12 px-4 border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                  data-testid="email-input"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-12 px-4 border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                    data-testid="phone-input"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full h-12 px-4 border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                  data-testid="password-input"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-none uppercase tracking-widest text-xs"
                data-testid="submit-button"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="toggle-auth-mode"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;