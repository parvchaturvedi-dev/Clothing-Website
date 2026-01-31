import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    minPrice: '',
    maxPrice: '',
    availability: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Shirts', 'Jackets', 'Dresses', 'Sweaters', 'Coats', 'Pants'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.size) {
      filtered = filtered.filter(p => p.sizes.includes(filters.size));
    }

    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    if (filters.availability) {
      filtered = filtered.filter(p => p.availability === (filters.availability === 'true'));
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      category: '',
      size: '',
      minPrice: '',
      maxPrice: '',
      availability: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 md:py-24" data-testid="products-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground mb-2">Discover</p>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-tight" data-testid="products-title">
            Explore Fashion
          </h1>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                data-testid="search-input"
              />
            </div>
            <Button
              variant="outline"
              className="h-12 px-6 rounded-none uppercase tracking-widest text-xs"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="filters-toggle"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="p-6 border border-border bg-secondary/10 space-y-4 animate-slide-up" data-testid="filters-panel">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Category</label>
                  <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                    <SelectTrigger className="h-10 rounded-none" data-testid="category-filter">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">All</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Size</label>
                  <Select value={filters.size} onValueChange={(value) => setFilters({ ...filters, size: value })}>
                    <SelectTrigger className="h-10 rounded-none" data-testid="size-filter">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">All</SelectItem>
                      {sizes.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Min Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full h-10 px-3 border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                    data-testid="min-price-filter"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Max Price</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full h-10 px-3 border border-border bg-transparent focus:outline-none focus:border-primary transition-colors"
                    data-testid="max-price-filter"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Availability</label>
                  <Select value={filters.availability} onValueChange={(value) => setFilters({ ...filters, availability: value })}>
                    <SelectTrigger className="h-10 rounded-none" data-testid="availability-filter">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">All</SelectItem>
                      <SelectItem value="true">In Stock</SelectItem>
                      <SelectItem value="false">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                variant="ghost"
                className="rounded-none uppercase tracking-widest text-xs"
                onClick={clearFilters}
                data-testid="clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground" data-testid="products-count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12" data-testid="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24" data-testid="no-products">
            <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-6 h-12 px-8 rounded-none uppercase tracking-widest text-xs"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;