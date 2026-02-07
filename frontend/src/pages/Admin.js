import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, ShoppingBag, Mail } from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sizes: '',
    images: '',
    availability: true
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Admin access required');
      navigate('/');
      return;
    }
    fetchStats();
    fetchProducts();
    fetchUsers();
    fetchEnquiries();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get(`${API}/admin/enquiries`);
      setEnquiries(response.data);
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      sizes: '',
      images: '',
      availability: true
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      sizes: product.sizes.join(', '),
      images: product.images.join(', '),
      availability: product.availability
    });
    setShowProductModal(true);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        category: productForm.category,
        sizes: productForm.sizes.split(',').map(s => s.trim()),
        images: productForm.images.split(',').map(s => s.trim()),
        availability: productForm.availability
      };

      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, productData);
        toast.success('Product updated successfully');
      } else {
        await axios.post(`${API}/products`, productData);
        toast.success('Product added successfully');
      }
      
      setShowProductModal(false);
      fetchProducts();
      fetchStats();
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`${API}/products/${productId}`);
      toast.success('Product deleted successfully');
      fetchProducts();
      fetchStats();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleReplyToEnquiry = async (enquiryId) => {
    const replyText = document.getElementById(`reply-${enquiryId}`).value.trim();
    if (!replyText) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      await axios.post(`${API}/admin/enquiries/${enquiryId}/reply`, {
        reply: replyText
      });
      toast.success('Reply sent successfully');
      fetchEnquiries();
      fetchStats();
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast.error('Failed to send reply');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 md:py-24" data-testid="admin-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-2" data-testid="admin-title">
            Admin Panel
          </h1>
          <p className="text-sm text-muted-foreground">Manage your fashion store</p>
        </div>

        <div className="flex space-x-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-4 px-4 text-sm uppercase tracking-widest transition-colors ${
              activeTab === 'stats' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'
            }`}
            data-testid="tab-stats"
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-4 text-sm uppercase tracking-widest transition-colors ${
              activeTab === 'products' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'
            }`}
            data-testid="tab-products"
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-4 text-sm uppercase tracking-widest transition-colors ${
              activeTab === 'users' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'
            }`}
            data-testid="tab-users"
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`pb-4 px-4 text-sm uppercase tracking-widest transition-colors ${
              activeTab === 'enquiries' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'
            }`}
            data-testid="tab-enquiries"
          >
            Enquiries
          </button>
        </div>

        {activeTab === 'stats' && stats && (
          <div data-testid="stats-section">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-secondary/20 border border-border">
                <Users className="w-8 h-8 mb-3" />
                <h3 className="text-2xl font-serif mb-1" data-testid="stat-users">{stats.total_users}</h3>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Total Users</p>
              </div>
              <div className="p-6 bg-secondary/20 border border-border">
                <ShoppingBag className="w-8 h-8 mb-3" />
                <h3 className="text-2xl font-serif mb-1" data-testid="stat-products">{stats.total_products}</h3>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Products</p>
              </div>
              <div className="p-6 bg-secondary/20 border border-border">
                <Mail className="w-8 h-8 mb-3" />
                <h3 className="text-2xl font-serif mb-1" data-testid="stat-enquiries">{stats.total_enquiries}</h3>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Total Enquiries</p>
              </div>
              <div className="p-6 bg-secondary/20 border border-border">
                <Mail className="w-8 h-8 mb-3" />
                <h3 className="text-2xl font-serif mb-1" data-testid="stat-pending">{stats.pending_enquiries}</h3>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Pending Enquiries</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div data-testid="products-section">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif">Products</h2>
              <Button
                onClick={handleAddProduct}
                className="h-10 px-6 rounded-none uppercase tracking-widest text-xs"
                data-testid="add-product-button"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </Button>
            </div>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex gap-6 p-6 border border-border" data-testid={`product-row-${product.id}`}>
                  <div className="w-24 h-32 overflow-hidden bg-secondary/20 flex-shrink-0">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-serif mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                    <p className="text-base font-medium mb-2">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Sizes: {product.sizes.join(', ')}</p>
                    <p className="text-xs text-muted-foreground">Status: {product.availability ? 'Available' : 'Out of Stock'}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleEditProduct(product)}
                      variant="outline"
                      size="sm"
                      className="rounded-none"
                      data-testid={`edit-product-${product.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteProduct(product.id)}
                      variant="outline"
                      size="sm"
                      className="rounded-none"
                      data-testid={`delete-product-${product.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div data-testid="users-section">
            <h2 className="text-2xl font-serif mb-6">Registered Users</h2>
            <div className="space-y-4">
              {users.map((u) => (
                <div key={u.id} className="p-6 border border-border" data-testid={`user-row-${u.id}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-serif mb-1">{u.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{u.email}</p>
                      {u.phone && <p className="text-sm text-muted-foreground">{u.phone}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Role</p>
                      <p className="text-sm">{u.role}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
                    <span>Login Count: {u.login_count}</span>
                    <span>Joined: {new Date(u.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'enquiries' && (
          <div data-testid="enquiries-section">
            <h2 className="text-2xl font-serif mb-6">Customer Enquiries</h2>
            <div className="space-y-4">
              {enquiries.map((enquiry) => (
                <div key={enquiry.id} className="p-6 border border-border" data-testid={`enquiry-row-${enquiry.id}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-serif mb-1">{enquiry.user_name}</h3>
                      <p className="text-sm text-muted-foreground">{enquiry.user_email}</p>
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-1 text-xs uppercase tracking-widest ${
                        enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {enquiry.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{enquiry.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(enquiry.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-2xl" data-testid="product-modal">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitProduct} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2">Product Name *</label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                required
                className="w-full h-10 px-3 border border-border bg-transparent focus:outline-none focus:border-primary"
                data-testid="product-name-input"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2">Description *</label>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                required
                rows={3}
                className="w-full px-3 py-2 border border-border bg-transparent focus:outline-none focus:border-primary resize-none"
                data-testid="product-description-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  required
                  className="w-full h-10 px-3 border border-border bg-transparent focus:outline-none focus:border-primary"
                  data-testid="product-price-input"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Category *</label>
                <input
                  type="text"
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  required
                  className="w-full h-10 px-3 border border-border bg-transparent focus:outline-none focus:border-primary"
                  data-testid="product-category-input"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2">Sizes (comma-separated) *</label>
              <input
                type="text"
                value={productForm.sizes}
                onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                required
                placeholder="S, M, L, XL"
                className="w-full h-10 px-3 border border-border bg-transparent focus:outline-none focus:border-primary"
                data-testid="product-sizes-input"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2">Image URLs (comma-separated) *</label>
              <input
                type="text"
                value={productForm.images}
                onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                required
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                className="w-full h-10 px-3 border border-border bg-transparent focus:outline-none focus:border-primary"
                data-testid="product-images-input"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={productForm.availability}
                onChange={(e) => setProductForm({ ...productForm, availability: e.target.checked })}
                className="w-4 h-4"
                data-testid="product-availability-input"
              />
              <label className="text-xs uppercase tracking-widest">Available</label>
            </div>
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1 h-10 rounded-none uppercase tracking-widest text-xs" data-testid="save-product">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowProductModal(false)}
                className="flex-1 h-10 rounded-none uppercase tracking-widest text-xs"
                data-testid="cancel-product"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;