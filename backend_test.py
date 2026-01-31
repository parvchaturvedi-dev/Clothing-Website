import requests
import sys
import json
from datetime import datetime

class LuxeFashionAPITester:
    def __init__(self, base_url="https://stylesphere-23.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_id = None
        self.test_product_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.token and not headers:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.text else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"Response: {response.json()}")
                except:
                    print(f"Response text: {response.text}")

            return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_user_registration(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        user_data = {
            "email": f"testuser{timestamp}@luxe.com",
            "password": "TestPass123!",
            "name": f"Test User {timestamp}",
            "phone": "+1234567890"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=user_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.test_user_id = response['user']['id']
            print(f"✅ User registered with ID: {self.test_user_id}")
            return True
        return False

    def test_user_login(self):
        """Test user login with admin credentials"""
        admin_data = {
            "email": "admin@luxe.com",
            "password": "Admin123"
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data=admin_data
        )
        
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            print(f"✅ Admin logged in successfully")
            return True
        return False

    def test_get_current_user(self):
        """Test get current user endpoint"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_get_products(self):
        """Test get products endpoint"""
        success, response = self.run_test(
            "Get Products",
            "GET",
            "products",
            200
        )
        
        if success and response:
            print(f"✅ Found {len(response)} products")
            if len(response) > 0:
                self.test_product_id = response[0]['id']
                print(f"✅ Using product ID for tests: {self.test_product_id}")
        return success

    def test_product_search_filters(self):
        """Test product search and filters"""
        # Test search by name
        success1, _ = self.run_test(
            "Product Search by Name",
            "GET",
            "products?search=shirt",
            200
        )
        
        # Test filter by category
        success2, _ = self.run_test(
            "Product Filter by Category",
            "GET",
            "products?category=Shirts",
            200
        )
        
        # Test filter by price range
        success3, _ = self.run_test(
            "Product Filter by Price Range",
            "GET",
            "products?min_price=100&max_price=300",
            200
        )
        
        # Test filter by size
        success4, _ = self.run_test(
            "Product Filter by Size",
            "GET",
            "products?size=M",
            200
        )
        
        # Test filter by availability
        success5, _ = self.run_test(
            "Product Filter by Availability",
            "GET",
            "products?availability=true",
            200
        )
        
        return all([success1, success2, success3, success4, success5])

    def test_get_single_product(self):
        """Test get single product endpoint"""
        if not self.test_product_id:
            print("❌ No product ID available for testing")
            return False
            
        success, response = self.run_test(
            "Get Single Product",
            "GET",
            f"products/{self.test_product_id}",
            200
        )
        return success

    def test_collections(self):
        """Test collections endpoints"""
        success, response = self.run_test(
            "Get Collections",
            "GET",
            "collections",
            200
        )
        return success

    def test_wishlist_operations(self):
        """Test wishlist operations"""
        if not self.test_product_id:
            print("❌ No product ID available for wishlist testing")
            return False
            
        # Get empty wishlist
        success1, _ = self.run_test(
            "Get Empty Wishlist",
            "GET",
            "wishlist",
            200
        )
        
        # Add to wishlist
        success2, _ = self.run_test(
            "Add to Wishlist",
            "POST",
            "wishlist/add",
            200,
            data={"product_id": self.test_product_id}
        )
        
        # Get wishlist with item
        success3, response = self.run_test(
            "Get Wishlist with Item",
            "GET",
            "wishlist",
            200
        )
        
        # Remove from wishlist
        success4, _ = self.run_test(
            "Remove from Wishlist",
            "DELETE",
            f"wishlist/remove/{self.test_product_id}",
            200
        )
        
        return all([success1, success2, success3, success4])

    def test_cart_operations(self):
        """Test cart operations"""
        if not self.test_product_id:
            print("❌ No product ID available for cart testing")
            return False
            
        # Get empty cart
        success1, _ = self.run_test(
            "Get Empty Cart",
            "GET",
            "cart",
            200
        )
        
        # Add to cart
        cart_item = {
            "product_id": self.test_product_id,
            "size": "M",
            "quantity": 2
        }
        success2, _ = self.run_test(
            "Add to Cart",
            "POST",
            "cart/add",
            200,
            data=cart_item
        )
        
        # Get cart with item
        success3, response = self.run_test(
            "Get Cart with Item",
            "GET",
            "cart",
            200
        )
        
        # Update cart item
        update_item = {
            "product_id": self.test_product_id,
            "size": "M",
            "quantity": 3
        }
        success4, _ = self.run_test(
            "Update Cart Item",
            "PUT",
            "cart/update",
            200,
            data=update_item
        )
        
        # Remove from cart
        success5, _ = self.run_test(
            "Remove from Cart",
            "DELETE",
            f"cart/remove/{self.test_product_id}?size=M",
            200
        )
        
        return all([success1, success2, success3, success4, success5])

    def test_enquiry_operations(self):
        """Test enquiry operations"""
        # Create enquiry
        enquiry_data = {
            "product_id": self.test_product_id,
            "message": "I would like to know more about this product's availability and sizing."
        }
        success1, response = self.run_test(
            "Create Enquiry",
            "POST",
            "enquiry",
            200,
            data=enquiry_data
        )
        
        # Get user enquiries
        success2, _ = self.run_test(
            "Get User Enquiries",
            "GET",
            "enquiry",
            200
        )
        
        return success1 and success2

    def test_admin_operations(self):
        """Test admin operations"""
        if not self.admin_token:
            print("❌ No admin token available")
            return False
            
        admin_headers = {'Authorization': f'Bearer {self.admin_token}'}
        
        # Get admin stats
        success1, response = self.run_test(
            "Get Admin Stats",
            "GET",
            "admin/stats",
            200,
            headers=admin_headers
        )
        
        # Get all users
        success2, _ = self.run_test(
            "Get All Users",
            "GET",
            "admin/users",
            200,
            headers=admin_headers
        )
        
        # Get all enquiries
        success3, _ = self.run_test(
            "Get All Enquiries",
            "GET",
            "admin/enquiries",
            200,
            headers=admin_headers
        )
        
        # Test product management
        new_product = {
            "name": "Test Product",
            "description": "A test product for API testing",
            "price": 99.99,
            "category": "Test",
            "sizes": ["S", "M", "L"],
            "images": ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800"],
            "availability": True
        }
        
        success4, product_response = self.run_test(
            "Create Product (Admin)",
            "POST",
            "products",
            200,
            data=new_product,
            headers=admin_headers
        )
        
        created_product_id = None
        if success4 and product_response:
            created_product_id = product_response.get('id')
        
        # Update product
        if created_product_id:
            updated_product = new_product.copy()
            updated_product['price'] = 149.99
            success5, _ = self.run_test(
                "Update Product (Admin)",
                "PUT",
                f"products/{created_product_id}",
                200,
                data=updated_product,
                headers=admin_headers
            )
            
            # Delete product
            success6, _ = self.run_test(
                "Delete Product (Admin)",
                "DELETE",
                f"products/{created_product_id}",
                200,
                headers=admin_headers
            )
        else:
            success5 = success6 = False
        
        return all([success1, success2, success3, success4, success5, success6])

def main():
    print("🚀 Starting LUXE Fashion API Testing...")
    tester = LuxeFashionAPITester()
    
    # Test sequence
    tests = [
        ("User Registration", tester.test_user_registration),
        ("Admin Login", tester.test_user_login),
        ("Get Current User", tester.test_get_current_user),
        ("Get Products", tester.test_get_products),
        ("Product Search & Filters", tester.test_product_search_filters),
        ("Get Single Product", tester.test_get_single_product),
        ("Collections", tester.test_collections),
        ("Wishlist Operations", tester.test_wishlist_operations),
        ("Cart Operations", tester.test_cart_operations),
        ("Enquiry Operations", tester.test_enquiry_operations),
        ("Admin Operations", tester.test_admin_operations),
    ]
    
    failed_tests = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        print(f"🧪 Running {test_name} Tests")
        print(f"{'='*50}")
        
        try:
            if not test_func():
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
            failed_tests.append(test_name)
    
    # Print final results
    print(f"\n{'='*60}")
    print(f"📊 FINAL TEST RESULTS")
    print(f"{'='*60}")
    print(f"✅ Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"❌ Tests failed: {tester.tests_run - tester.tests_passed}/{tester.tests_run}")
    
    if failed_tests:
        print(f"\n❌ Failed test categories:")
        for test in failed_tests:
            print(f"  - {test}")
    else:
        print(f"\n🎉 All test categories passed!")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"\n📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if success_rate >= 80 else 1

if __name__ == "__main__":
    sys.exit(main())