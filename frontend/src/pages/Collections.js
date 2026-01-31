import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(`${API}/collections`);
      setCollections(response.data);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 md:py-24" data-testid="collections-page">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground mb-2">Curated</p>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-tight" data-testid="collections-title">
            Our Collections
          </h1>
        </div>

        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid="collections-grid">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.id}`}
                className="group relative overflow-hidden aspect-[4/5] animate-fade-in"
                data-testid={`collection-card-${collection.id}`}
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
                  <h2 className="text-3xl md:text-4xl font-serif mb-2" data-testid="collection-name">{collection.name}</h2>
                  <p className="text-sm font-light mb-4" data-testid="collection-description">{collection.description}</p>
                  <span className="text-xs uppercase tracking-widest flex items-center">
                    Explore Collection <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24" data-testid="no-collections">
            <p className="text-lg text-muted-foreground">No collections available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;