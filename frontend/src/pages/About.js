import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen" data-testid="about-page">
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground mb-4 text-center">Our Story</p>
            <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-tight mb-12 text-center" data-testid="about-title">
              About LUXE
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1759925847175-01d42373454b?w=800"
                alt="LUXE Fashion"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <p className="text-lg md:text-xl font-light leading-relaxed">
                LUXE was founded with a singular vision: to create fashion that embodies timeless elegance and sophisticated style.
              </p>
              <p className="text-base font-light leading-relaxed text-muted-foreground">
                We believe that true luxury lies not in fleeting trends, but in pieces that stand the test of time. Each item in our collection is carefully selected for its exceptional quality, impeccable craftsmanship, and enduring appeal.
              </p>
              <p className="text-base font-light leading-relaxed text-muted-foreground">
                Our commitment extends beyond aesthetics. We partner with artisans and manufacturers who share our values of excellence, sustainability, and ethical practices.
              </p>
            </div>
          </div>

          <div className="bg-secondary/20 p-12 md:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-8">Our Philosophy</h2>
              <p className="text-lg font-light leading-relaxed mb-8">
                Fashion is more than clothing—it's an expression of identity, a celebration of individuality, and a reflection of personal values.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div>
                  <h3 className="text-xl font-serif mb-3">Quality</h3>
                  <p className="text-sm text-muted-foreground">Premium materials and exceptional craftsmanship in every piece</p>
                </div>
                <div>
                  <h3 className="text-xl font-serif mb-3">Elegance</h3>
                  <p className="text-sm text-muted-foreground">Timeless designs that transcend seasonal trends</p>
                </div>
                <div>
                  <h3 className="text-xl font-serif mb-3">Service</h3>
                  <p className="text-sm text-muted-foreground">Personalized attention and dedicated support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;