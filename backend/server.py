from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

SECRET_KEY = os.environ.get('SECRET_KEY', 'luxury-fashion-secret-key-2024')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 43200

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    phone: Optional[str] = None
    role: str = "customer"
    login_count: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    phone: str
    first_letter: str
    new_password: str
    confirm_password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    category: str
    sizes: List[str]
    images: List[str]
    availability: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    sizes: List[str]
    images: List[str]
    availability: bool = True

class Collection(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    image: str
    product_ids: List[str] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CollectionCreate(BaseModel):
    name: str
    description: str
    image: str
    product_ids: List[str] = []

class WishlistItem(BaseModel):
    product_id: str

class CartItem(BaseModel):
    product_id: str
    size: str
    quantity: int = 1

class CartUpdate(BaseModel):
    product_id: str
    size: str
    quantity: int

class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    product_id: Optional[str] = None
    message: str
    status: str = "pending"
    user_name: str
    user_email: str
    admin_reply: Optional[str] = None
    replied_at: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class EnquiryCreate(BaseModel):
    product_id: Optional[str] = None
    message: str

class EnquiryReply(BaseModel):
    reply: str

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await db.users.find_one({"email": email}, {"_id": 0, "password": 0})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

async def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user_data.model_dump()
    hashed_password = hash_password(user_dict.pop("password"))
    
    user = User(**user_dict)
    user_doc = user.model_dump()
    user_doc["password"] = hashed_password
    
    await db.users.insert_one(user_doc)
    
    access_token = create_access_token(data={"sub": user.email})
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    await db.users.update_one(
        {"email": credentials.email},
        {"$inc": {"login_count": 1}}
    )
    
    user.pop("_id", None)
    user.pop("password", None)
    user_obj = User(**user)
    user_obj.login_count += 1
    
    access_token = create_access_token(data={"sub": user_obj.email})
    return Token(access_token=access_token, token_type="bearer", user=user_obj)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@api_router.post("/auth/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    # Validate new password matches confirm password
    if request.new_password != request.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    if len(request.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    
    # Find user with matching email
    user = await db.users.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Verify phone number
    if user.get("phone") != request.phone:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Verify first letter of name (lowercase)
    if user.get("name", "")[0].lower() != request.first_letter.lower():
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Update password
    hashed_password = hash_password(request.new_password)
    await db.users.update_one(
        {"email": request.email},
        {"$set": {"password": hashed_password}}
    )
    
    logging.info(f"Password reset successful for {request.email}")
    return {"message": "Password has been reset successfully"}

@api_router.get("/products", response_model=List[Product])
async def get_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    size: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    availability: Optional[bool] = None
):
    query = {}
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    if category:
        query["category"] = category
    if size:
        query["sizes"] = size
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price
    if availability is not None:
        query["availability"] = availability
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    return [Product(**p) for p in products]

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@api_router.post("/products", response_model=Product)
async def create_product(product_data: ProductCreate, admin: User = Depends(get_admin_user)):
    product = Product(**product_data.model_dump())
    await db.products.insert_one(product.model_dump())
    return product

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_data: ProductCreate, admin: User = Depends(get_admin_user)):
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": product_data.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    return Product(**product)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, admin: User = Depends(get_admin_user)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@api_router.get("/collections", response_model=List[Collection])
async def get_collections():
    collections = await db.collections.find({}, {"_id": 0}).to_list(1000)
    return [Collection(**c) for c in collections]

@api_router.get("/collections/{collection_id}", response_model=Collection)
async def get_collection(collection_id: str):
    collection = await db.collections.find_one({"id": collection_id}, {"_id": 0})
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return Collection(**collection)

@api_router.post("/collections", response_model=Collection)
async def create_collection(collection_data: CollectionCreate, admin: User = Depends(get_admin_user)):
    collection = Collection(**collection_data.model_dump())
    await db.collections.insert_one(collection.model_dump())
    return collection

@api_router.get("/wishlist", response_model=List[str])
async def get_wishlist(current_user: User = Depends(get_current_user)):
    wishlist = await db.wishlists.find_one({"user_id": current_user.id}, {"_id": 0})
    if not wishlist:
        return []
    return wishlist.get("product_ids", [])

@api_router.post("/wishlist/add")
async def add_to_wishlist(item: WishlistItem, current_user: User = Depends(get_current_user)):
    await db.wishlists.update_one(
        {"user_id": current_user.id},
        {"$addToSet": {"product_ids": item.product_id}},
        upsert=True
    )
    return {"message": "Added to wishlist"}

@api_router.delete("/wishlist/remove/{product_id}")
async def remove_from_wishlist(product_id: str, current_user: User = Depends(get_current_user)):
    await db.wishlists.update_one(
        {"user_id": current_user.id},
        {"$pull": {"product_ids": product_id}}
    )
    return {"message": "Removed from wishlist"}

@api_router.get("/cart")
async def get_cart(current_user: User = Depends(get_current_user)):
    cart = await db.carts.find_one({"user_id": current_user.id}, {"_id": 0})
    if not cart:
        return {"items": []}
    return {"items": cart.get("items", [])}

@api_router.post("/cart/add")
async def add_to_cart(item: CartItem, current_user: User = Depends(get_current_user)):
    cart = await db.carts.find_one({"user_id": current_user.id})
    
    if cart:
        items = cart.get("items", [])
        existing_item = next((i for i in items if i["product_id"] == item.product_id and i["size"] == item.size), None)
        
        if existing_item:
            existing_item["quantity"] += item.quantity
            await db.carts.update_one(
                {"user_id": current_user.id},
                {"$set": {"items": items}}
            )
        else:
            await db.carts.update_one(
                {"user_id": current_user.id},
                {"$push": {"items": item.model_dump()}}
            )
    else:
        await db.carts.insert_one({
            "user_id": current_user.id,
            "items": [item.model_dump()]
        })
    
    return {"message": "Added to cart"}

@api_router.put("/cart/update")
async def update_cart(item: CartUpdate, current_user: User = Depends(get_current_user)):
    cart = await db.carts.find_one({"user_id": current_user.id})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    items = cart.get("items", [])
    for i in items:
        if i["product_id"] == item.product_id and i["size"] == item.size:
            i["quantity"] = item.quantity
            break
    
    await db.carts.update_one(
        {"user_id": current_user.id},
        {"$set": {"items": items}}
    )
    return {"message": "Cart updated"}

@api_router.delete("/cart/remove/{product_id}")
async def remove_from_cart(product_id: str, size: str, current_user: User = Depends(get_current_user)):
    await db.carts.update_one(
        {"user_id": current_user.id},
        {"$pull": {"items": {"product_id": product_id, "size": size}}}
    )
    return {"message": "Removed from cart"}

@api_router.post("/enquiry", response_model=Enquiry)
async def create_enquiry(enquiry_data: EnquiryCreate, current_user: User = Depends(get_current_user)):
    enquiry = Enquiry(
        user_id=current_user.id,
        user_name=current_user.name,
        user_email=current_user.email,
        **enquiry_data.model_dump()
    )
    await db.enquiries.insert_one(enquiry.model_dump())
    return enquiry

@api_router.get("/enquiry", response_model=List[Enquiry])
async def get_user_enquiries(current_user: User = Depends(get_current_user)):
    enquiries = await db.enquiries.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    return [Enquiry(**e) for e in enquiries]

@api_router.get("/admin/enquiries", response_model=List[Enquiry])
async def get_all_enquiries(admin: User = Depends(get_admin_user)):
    enquiries = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Enquiry(**e) for e in enquiries]

@api_router.post("/admin/enquiries/{enquiry_id}/reply")
async def reply_to_enquiry(enquiry_id: str, reply_data: EnquiryReply, admin: User = Depends(get_admin_user)):
    result = await db.enquiries.update_one(
        {"id": enquiry_id},
        {
            "$set": {
                "admin_reply": reply_data.reply,
                "replied_at": datetime.now(timezone.utc).isoformat(),
                "status": "replied"
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    
    return {"message": "Reply sent successfully"}

@api_router.get("/admin/users", response_model=List[User])
async def get_all_users(admin: User = Depends(get_admin_user)):
    users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(1000)
    return [User(**u) for u in users]

@api_router.get("/admin/stats")
async def get_admin_stats(admin: User = Depends(get_admin_user)):
    total_users = await db.users.count_documents({"role": "customer"})
    total_products = await db.products.count_documents({})
    total_enquiries = await db.enquiries.count_documents({})
    pending_enquiries = await db.enquiries.count_documents({"status": "pending"})
    
    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_enquiries": total_enquiries,
        "pending_enquiries": pending_enquiries
    }

async def init_admin():
    admin_email = "admin@luxe.com"
    existing_admin = await db.users.find_one({"email": admin_email})
    
    if not existing_admin:
        admin_user = User(
            email=admin_email,
            name="Administrator",
            phone="1234567890",
            role="admin"
        )
        admin_doc = admin_user.model_dump()
        admin_doc["password"] = hash_password("Admin123")
        await db.users.insert_one(admin_doc)
        logging.info(f"Admin user created with email: {admin_email} and password: Admin123")

async def init_sample_data():
    product_count = await db.products.count_documents({})
    if product_count == 0:
        sample_products = [
            {
                "id": str(uuid.uuid4()),
                "name": "Classic White Shirt",
                "description": "Timeless white cotton shirt with clean lines and premium finish",
                "price": 129.99,
                "category": "Shirts",
                "sizes": ["S", "M", "L", "XL"],
                "images": ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800"],
                "availability": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Tailored Black Blazer",
                "description": "Sophisticated black blazer with impeccable tailoring",
                "price": 349.99,
                "category": "Jackets",
                "sizes": ["S", "M", "L", "XL"],
                "images": ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"],
                "availability": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Silk Evening Dress",
                "description": "Elegant silk dress perfect for special occasions",
                "price": 599.99,
                "category": "Dresses",
                "sizes": ["XS", "S", "M", "L"],
                "images": ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"],
                "availability": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Cashmere Sweater",
                "description": "Luxuriously soft cashmere sweater in neutral tones",
                "price": 249.99,
                "category": "Sweaters",
                "sizes": ["S", "M", "L"],
                "images": ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800"],
                "availability": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Wool Trench Coat",
                "description": "Classic trench coat crafted from premium wool",
                "price": 499.99,
                "category": "Coats",
                "sizes": ["S", "M", "L", "XL"],
                "images": ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800"],
                "availability": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Linen Summer Dress",
                "description": "Breathable linen dress with flowing silhouette",
                "price": 189.99,
                "category": "Dresses",
                "sizes": ["XS", "S", "M", "L", "XL"],
                "images": ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800"],
                "availability": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.products.insert_many(sample_products)
        
        sample_collections = [
            {
                "id": str(uuid.uuid4()),
                "name": "Spring Collection",
                "description": "Fresh styles for the new season",
                "image": "https://images.unsplash.com/photo-1769107805528-964f4de0e342?w=800",
                "product_ids": [],
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Evening Wear",
                "description": "Sophisticated pieces for special occasions",
                "image": "https://images.unsplash.com/photo-1767334010488-83cdb8539273?w=800",
                "product_ids": [],
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.collections.insert_many(sample_collections)
        logging.info("Sample data created")

@app.on_event("startup")
async def startup_event():
    await init_admin()
    await init_sample_data()

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()