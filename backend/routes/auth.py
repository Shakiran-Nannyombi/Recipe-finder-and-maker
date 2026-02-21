import os
import jwt
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import ValidationError

from models.auth import UserCreate, UserLogin, User, Token, TokenData
from services.supabase_service import SupabaseService

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

# Security utilities
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

router = APIRouter(prefix="/api/auth", tags=["auth"])

def get_supabase_service() -> SupabaseService:
    return SupabaseService()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    supabase_service: SupabaseService = Depends(get_supabase_service)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except (jwt.PyJWTError, ValidationError):
        raise credentials_exception
    
    # Fetch user from Supabase
    response = supabase_service.client.table("users").select("*").eq("email", token_data.email).execute()
    if not response.data or len(response.data) == 0:
        raise credentials_exception
    
    user_data = response.data[0]
    return User(
        id=user_data["id"],
        email=user_data["email"],
        name=user_data["name"],
        created_at=datetime.fromisoformat(user_data["created_at"])
    )

@router.post("/signup", response_model=Token)
async def signup(
    user_in: UserCreate,
    supabase_service: SupabaseService = Depends(get_supabase_service)
):
    # Check if user already exists
    response = supabase_service.client.table("users").select("*").eq("email", user_in.email).execute()
    if response.data and len(response.data) > 0:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )
    
    # Create new user
    user_data = {
        "email": user_in.email,
        "name": user_in.name,
        "hashed_password": get_password_hash(user_in.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    response = supabase_service.client.table("users").insert(user_data).execute()
    if not response.data:
        raise HTTPException(
            status_code=500,
            detail="Failed to create user"
        )
    
    access_token = create_access_token(data={"sub": user_in.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(
    user_in: UserLogin,
    supabase_service: SupabaseService = Depends(get_supabase_service)
):
    # Fetch user
    response = supabase_service.client.table("users").select("*").eq("email", user_in.email).execute()
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    
    user_data = response.data[0]
    if not verify_password(user_in.password, user_data["hashed_password"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user_in.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
