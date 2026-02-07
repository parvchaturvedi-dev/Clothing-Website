import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    phone: '',
    first_letter: '',
    new_password: '',
    confirm_password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      } else {
        await register(formData);
        toast.success('Account created successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.detail || (isLogin ? 'Login failed' : 'Registration failed');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/auth/forgot-password`, forgotPasswordData);
      toast.success('Password reset successfully!');
      setShowForgotPassword(false);
      setForgotPasswordData({
        email: '',
        phone: '',
        first_letter: '',
        new_password: '',
        confirm_password: ''
      });
      toast.info('You can now login with your new password');
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to reset password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen py-16 md:py-24 flex items-center" data-testid="forgot-password-page">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4" data-testid="forgot-password-title">
                Reset Password
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your details to reset your password
              </p>
            </div>

            <div className="bg-secondary/20 p-8">
              <form onSubmit={handleForgotPassword} className="space-y-6" data-testid="forgot-password-form">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={forgotPasswordData.email}
                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })}
                    required
                    className="w-full h-12 px-4 border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                    placeholder="your@email.com"
                    data-testid="forgot-password-email-input"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Registered Mobile Number *</label>
                  <input
                    type="tel"
                    value={forgotPasswordData.phone}
                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, phone: e.target.value })}
                    required
                    className="w-full h-12 px-4 border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                    placeholder="1234567890"
                    data-testid="forgot-password-phone-input"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">First Letter of Name (lowercase) *</label>
                  <input
                    type="text"
                    value={forgotPasswordData.first_letter}
                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, first_letter: e.target.value.toLowerCase() })}
                    required
                    maxLength={1}
                    className="w-full h-12 px-4 border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                    placeholder="a"
                    data-testid="forgot-password-first-letter-input"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">New Password *</label>
                  <input
                    type="password"
                    value={forgotPasswordData.new_password}
                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, new_password: e.target.value })}
                    required
                    minLength={6}
                    className="w-full h-12 px-4 border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                    placeholder="Min 6 characters"
                    data-testid="forgot-password-new-password-input"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Confirm New Password *</label>
                  <input
                    type="password"
                    value={forgotPasswordData.confirm_password}
                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, confirm_password: e.target.value })}
                    required
                    minLength={6}
                    className="w-full h-12 px-4 border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                    placeholder="Confirm password"
                    data-testid="forgot-password-confirm-password-input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-none uppercase tracking-widest text-xs"
                  data-testid="forgot-password-submit"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordData({
                      email: '',
                      phone: '',
                      first_letter: '',
                      new_password: '',
                      confirm_password: ''
                    });
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="back-to-login"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  <label className="block text-xs uppercase tracking-widest mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required={!isLogin}
                    className="w-full h-12 px-4 border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                    placeholder="Required for password reset"
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

              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="forgot-password-link"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

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