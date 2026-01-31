import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import ProductCard from '../components/ProductCard';
import { useInView } from 'react-intersection-observer';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: productsRef, inView: productsInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data.slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await axios.get(`${API}/collections`);
      setCollections(response.data);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    }
  };

  return (
    <div data-testid="home-page">
      <section
        ref={heroRef}
        className={`min-h-[90vh] relative flex items-center justify-center ${heroInView ? 'animate-fade-in' : 'opacity-0'}`}
        data-testid="hero-section"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1705232497552-abd05ad64485?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920"
            alt="Fashion Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-tight mb-6" data-testid="hero-title">
            Timeless Elegance
          </h1>
          <p className="text-lg md:text-xl font-light leading-relaxed mb-8 max-w-2xl mx-auto" data-testid="hero-subtitle">
            Discover curated pieces that define sophisticated style
          </p>
          <Link to="/products">
            <Button className="h-12 px-8 rounded-none uppercase tracking-widest text-xs bg-white text-black hover:bg-white/90" data-testid="explore-button">
              Explore Fashion
            </Button>
          </Link>
        </div>
      </section>

      {collections.length > 0 && (
        <section className="py-16 md:py-24 lg:py-32" data-testid="collections-section">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground mb-2">Curated Collections</p>
              <h2 className="text-4xl md:text-5xl font-serif tracking-tight">Featured Collections</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  to={`/collections/${collection.id}`}
                  className="group relative overflow-hidden aspect-[4/5] animate-slide-up"
                  data-testid={`collection-card-${collection.id}`}
                >
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
                    <h3 className="text-3xl font-serif mb-2">{collection.name}</h3>
                    <p className="text-sm font-light mb-4">{collection.description}</p>
                    <span className="text-xs uppercase tracking-widest flex items-center">
                      View Collection <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        ref={productsRef}
        className={`py-16 md:py-24 lg:py-32 bg-secondary/20 ${productsInView ? 'animate-slide-up' : 'opacity-0'}`}
        data-testid="bestsellers-section"
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground mb-2">Customer Favorites</p>
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight">Best Sellers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="outline" className="h-12 px-8 rounded-none uppercase tracking-widest text-xs" data-testid="view-all-button">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-lg font-serif mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">Crafted from the finest materials</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-serif mb-2">Timeless Design</h3>
              <p className="text-sm text-muted-foreground">Styles that transcend trends</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-serif mb-2">Exceptional Service</h3>
              <p className="text-sm text-muted-foreground">Personalized attention to detail</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;