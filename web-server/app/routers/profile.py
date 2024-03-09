from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from app.services.storage_service import generate_put_presigned_url, generate_get_presigned_url
from app.services.auth_service import get_db_user_from_token
from app.settings import settings as env
from app.models import File, User
from app.dependencies import db_dependency, user_dependency
from app.responses import unauthorized_response, not_found_response
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix='/profile', tags=['profile'])

class UserSettingsResponse(BaseModel):
    username: str
    email: str

@router.get("/user-settings",
    responses={
        409: unauthorized_response,
        404: not_found_response,
    }
)
async def get_user_settings(user: user_dependency, db: db_dependency) -> UserSettingsResponse:
    # Query the user from the database
    db_user = db.query(User).filter(User.email == user["email"]).first()
    
    # Check if the user was found
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Construct the UserSettingsResponse object
    return UserSettingsResponse(username=db_user.username, email=db_user.email)



class UserSettingsUpdateRequest(BaseModel):
    username: str

@router.post("/user-settings", responses={409: unauthorized_response})
async def update_user_settings(user: user_dependency, db: db_dependency, settings: UserSettingsUpdateRequest):
    user = db.query(User).filter(User.email == user["email"]).first()
    user.username = settings.username
    db.commit()
    return Response(status_code=status.HTTP_200_OK, content="User settings updated.", media_type="text/plain")