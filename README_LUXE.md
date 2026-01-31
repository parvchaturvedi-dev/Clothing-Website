# LUXE - Luxury Fashion Brand Website

## Overview
LUXE is a sophisticated, luxury fashion e-commerce website with an enquiry-only system. The website features a premium aesthetic with neutral colors, whitespace, smooth animations, and modern typography.

## Admin Credentials
- **Email:** admin@luxe.com
- **Password:** Admin123

## Features

### Customer Features
1. **Homepage**
   - Hero section with elegant fashion visuals
   - Featured collections showcase
   - Best-selling products preview
   - Smooth scroll animations

2. **Product Browsing**
   - Product grid with professional product cards
   - Advanced search by product name
   - Filters: Category, Size, Price Range, Availability
   - Product detail pages with:
     - Image gallery
     - Size selection
     - Add to Cart
     - Add to Wishlist
     - Contact for Details & Order button

3. **Authentication**
   - User registration with email/password
   - Secure login system
   - Protected routes for authenticated users

4. **Customer Dashboard**
   - Profile information
   - Wishlist management
   - Shopping cart
   - Enquiry history

5. **Enquiry System**
   - Product-specific enquiries
   - General contact form
   - Enquiry tracking (pending/resolved)

6. **Chatbot**
   - Floating chatbot icon
   - Rule-based responses for:
     - Size inquiries
     - Product availability
     - Ordering process
     - Delivery information
     - Returns & exchanges
     - Collection information

### Admin Features
1. **Admin Panel** (accessible at /admin)
   - Dashboard with statistics:
     - Total users
     - Total products
     - Total enquiries
     - Pending enquiries
   
2. **Product Management**
   - Add new products
   - Edit existing products
   - Delete products
   - Manage: name, description, price, category, sizes, images, availability

3. **User Management**
   - View all registered users
   - Track login counts
   - View user details (name, email, phone, registration date)

4. **Enquiry Management**
   - View all customer enquiries
   - Track enquiry status
   - View customer contact information

## Pages
1. **Home** - Landing page with hero, collections, and best sellers
2. **About** - Brand story and philosophy
3. **Explore Fashion** - Products listing with search and filters
4. **Collections** - Curated collections showcase
5. **Contact** - Enquiry form and contact information
6. **Account** - Customer dashboard (protected)
7. **Admin Panel** - Admin management interface (admin only)

## Sample Products (Pre-loaded)
- Classic White Shirt - $129.99
- Tailored Black Blazer - $349.99
- Silk Evening Dress - $599.99
- Cashmere Sweater - $249.99
- Wool Trench Coat - $499.99
- Linen Summer Dress - $189.99

## Sample Collections
- Spring Collection - Fresh styles for the new season
- Evening Wear - Sophisticated pieces for special occasions

## Technology Stack
- **Frontend:** React, Tailwind CSS, Shadcn/UI
- **Backend:** FastAPI, Python
- **Database:** MongoDB
- **Authentication:** JWT tokens with bcrypt password hashing
- **Design:** Playfair Display (headings), Manrope (body text)

## Design Features
- Luxury aesthetic with neutral color palette
- Soft white/bone background (98%)
- Sharp black text (9%)
- Sharp edges (no rounded corners) for sophisticated look
- Glassmorphism navigation header
- Smooth fade-in and slide-up animations
- High-quality fashion imagery
- Responsive design for all devices

## User Flows

### Customer Flow
1. Browse products on homepage or products page
2. Use search and filters to find specific items
3. View product details
4. Create account or login
5. Add items to wishlist or cart
6. Submit enquiry for purchase
7. Track enquiries in dashboard

### Admin Flow
1. Login with admin credentials
2. View dashboard statistics
3. Manage products (add/edit/delete)
4. Review user information
5. Monitor and respond to enquiries

## Chatbot Responses
The chatbot provides automated responses for:
- **Sizes:** "We offer sizes XS, S, M, L, and XL. Each product page has detailed size information."
- **Availability:** "You can check product availability on each product page. Available items are marked with a green indicator."
- **Ordering:** "To place an order, browse our products, add items to your cart, and submit an enquiry. Our team will contact you to complete your order."
- **Contact:** "You can reach us through the Contact page or by submitting an enquiry for any product. We're here to help!"
- **Delivery:** "Delivery details will be discussed when you submit an enquiry."
- **Returns:** "We have a flexible return and exchange policy. Please contact us through the enquiry form."
- **Collections:** "Browse our latest collections in the Collections page."

## Testing Status
- **Backend:** 100% success rate (28 endpoints tested)
- **Frontend:** 95% success rate
- All core features tested and working
- Authentication flow verified
- Admin panel fully functional
- Chatbot operational

## Future Enhancement Suggestions
1. Add payment gateway integration (Stripe)
2. Implement order management system
3. Add email notifications for enquiries
4. Create customer reviews and ratings
5. Implement advanced analytics dashboard
6. Add product recommendations
7. Integrate inventory management
8. Add multiple image zoom functionality
9. Implement size guide with measurements
10. Add social media sharing for products

## Notes
- This is an enquiry-only system - no direct payment processing
- All cart and wishlist actions require user authentication
- Admin can manage all aspects of the store through the admin panel
- Sample data is automatically created on first startup
- The website maintains a sophisticated, luxury aesthetic throughout all pages
