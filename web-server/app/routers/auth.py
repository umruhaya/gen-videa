from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from typing import Annotated
from datetime import timedelta
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.schemas.auth_schema import CreateUserRequest, Token, OAuth2EmailPasswordRequestForm
from app.services.auth_service import authenticate_user, create_access_token, oauth2_bearer
from app.core.security import bcrypt_context
from app.dependencies import db_dependency
from app.models import User
from app.settings import settings as env
from app.responses import unauthorized_response, conflict_response

router = APIRouter(prefix='/auth', tags=['auth'])

@router.post("/signup", status_code=status.HTTP_201_CREATED, responses={409: conflict_response})
async def create_user(db: db_dependency, create_user_request: CreateUserRequest):
    create_user_model = User(
        email=create_user_request.email,  # email should be unique
        username=create_user_request.username,
        password=bcrypt_context.hash(create_user_request.password),
    )
    try:
        db.add(create_user_model)
        db.commit()
        return f"User {create_user_model.username} created successfully."
    except IntegrityError as e:
        db.rollback()  # It's important to roll back the session to a clean state
        # Check if the error is due to a duplicate email
        if 'unique constraint' in str(e.orig).lower() and 'email' in str(e.orig).lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already exists."
            )
        else:
            # If the error is not due to a duplicate email, re-raise it
            raise

@router.post("/token", response_model=Token, responses={
    401: {
        "description": "Unauthorized",
        "content": {
            "application/json": {"example": {"detail": "Could not validate user."}}
        }
    }
})
async def login_for_access_token(form_data: Annotated[OAuth2EmailPasswordRequestForm, Depends()], db: db_dependency, response: Response):
    user = authenticate_user(form_data.email, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail='Could not validate user.'
        )
    
    token = create_access_token(
        email=form_data.email, 
        expires_delta=timedelta(hours=env.ACCESS_TOKEN_EXPIRE_HOURS)
    )

    response.set_cookie(key="access_token", value=token, samesite="Lax")
    # return {"message": "Login successful"}

    return {"access_token": token, 'token_type':'bearer'}

@router.post("/logout", responses={409: unauthorized_response})
async def logout(request: Request, response: Response):

    if request.cookies.get("access_token"):
        response.delete_cookie(key="access_token", samesite="Lax")
        return {"message": "Logout successful"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail='Could not validate user.'
        )