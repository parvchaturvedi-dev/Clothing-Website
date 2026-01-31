import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Contact = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    message: location.state?.productName
      ? `I'm interested in ${location.state.productName}`
      : ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to submit enquiry');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const enquiryData = {
        message: formData.message,
        product_id: location.state?.productId || null
      };
      
      await axios.post(`${API}/enquiry`, enquiryData);
      toast.success('Enquiry submitted successfully! We will contact you soon.');
      setFormData({ message: '' });
    } catch (error) {
      console.error('Failed to submit enquiry:', error);
      toast.error('Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 md:py-24" data-testid="contact-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground mb-2">Get in Touch</p>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-tight" data-testid="contact-title">
            Contact Us
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif mb-6">We're Here to Help</h2>
              <p className="text-base font-light leading-relaxed text-muted-foreground">
                Have a question about our products or need styling advice? Our team is ready to assist you. Submit an enquiry and we'll get back to you promptly.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-secondary flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-widest font-medium mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground">contact@luxe.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-secondary flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-widest font-medium mb-1">Phone</h3>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-secondary flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-widest font-medium mb-1">Address</h3>
                  <p className="text-sm text-muted-foreground">
                    123 Fashion Avenue<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <h3 className="text-lg font-serif mb-3">Business Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-secondary/20 p-8">
            <h2 className="text-2xl font-serif mb-6">Submit an Enquiry</h2>
            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-accent/30 border border-border">
                <p className="text-sm">Please <a href="/login" className="underline">login</a> to submit an enquiry.</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="enquiry-form">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Your Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={8}
                  className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell us about your inquiry..."
                  data-testid="enquiry-message"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !isAuthenticated}
                className="w-full h-12 rounded-none uppercase tracking-widest text-xs"
                data-testid="submit-enquiry"
              >
                {loading ? 'Submitting...' : 'Submit Enquiry'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;