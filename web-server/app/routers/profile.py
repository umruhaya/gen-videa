from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.exc import IntegrityError
from app.settings import settings as env
from app.models import File, User
from app.dependencies import db_dependency, user_dependency
from app.responses import unauthorized_response, conflict_response, not_found_response

from pydantic import BaseModel
from typing import List

router = APIRouter(prefix='/profile', tags=['profile'])

class UserSettingsResponse(BaseModel):
    username: str
    email: str
    bio: Optional[str]
    profile_picture: Optional[str]

@router.get("/user-settings",
    responses={
        401: unauthorized_response,
        404: not_found_response,
        409: conflict_response,
    }
)
async def get_user_settings(user: user_dependency, db: db_dependency) -> UserSettingsResponse:
    # Query the user from the database
    db_user = db.query(User).filter(User.email == user["email"]).first()
    
    # Check if the user was found
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Construct the UserSettingsResponse object
    return UserSettingsResponse(
        username=db_user.username, 
        email=db_user.email, 
        bio=db_user.bio, 
        profile_picture=db_user.profile_picture
    )
class UserSettingsUpdateRequest(BaseModel):
    username: Optional[str] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None

@router.post("/user-settings", responses={401: unauthorized_response, 409: conflict_response})
async def update_user_settings(user: user_dependency, db: db_dependency, settings: UserSettingsUpdateRequest):
    user = db.query(User).filter(User.email == user["email"]).first()
    if settings.username:
        user.username = settings.username
    if settings.bio:
        user.bio = settings.bio
    if settings.profile_picture:
        user.profile_picture = settings.profile_picture
    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists.")
    return Response(status_code=status.HTTP_200_OK, content="User settings updated.", media_type="text/plain")