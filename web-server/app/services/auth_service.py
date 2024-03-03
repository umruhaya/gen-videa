from app.core.security import bcrypt_context
from app.models import User
from app.settings import settings as env
from fastapi import HTTPException, status, Depends, Cookie, Request
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from jose import JWTError
from datetime import timedelta, datetime
from sqlalchemy.orm import Session
from jose import jwt

oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")

def authenticate_user(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    if not user or not bcrypt_context.verify(password, user.password):
        return None
    sanitized_user = { 'username': user.username, 'email': user.email }
    return sanitized_user

def create_access_token(email: str, expires_delta: timedelta):
    encode = {'sub': email }
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, env.SECRET_KEY, algorithm=env.ALGORITHM)

async def get_current_user(request: Request):
    access_token = request.cookies.get('access_token')
    if access_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Could not validate user.')
    try:
        payload = jwt.decode(access_token, env.SECRET_KEY, algorithms=[env.ALGORITHM])
        email: str = payload.get('sub')
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Could not validate user.')
        return { 'email':email }
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Could not validate user.')
    
def get_db_user_from_token(email: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    sanitized_user = { 'username': user.username, 'email': user.email }
    return sanitized_user