from pydantic import BaseModel, EmailStr, field_validator
from fastapi import Form

class CreateUserRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char in '!@#$%^&*()-_=+[]{};:,.<>?/|\\' for char in v):
            raise ValueError('Password must contain at least one special character')
        if not any(char.islower() for char in v):
            raise ValueError('Password must contain at least one lowercase letter')
        return v
    
class OAuth2EmailPasswordRequestForm:
    def __init__(
        self,
        email: str = Form(...),
        password: str = Form(...),
    ):
        self.email = email
        self.password = password
    
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"