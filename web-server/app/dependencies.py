# Declare all the dependency injections here
from fastapi import Depends
from app.database import get_db
from app.services.auth_service import get_current_user
from sqlalchemy.orm import Session
from typing import Annotated

db_dependency = Annotated[str, Depends(get_db)]

user_dependency = Annotated[str, Depends(get_current_user)]