import io
import base64
import uuid
import os
import logging
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
from app.services.storage_service import upload_file_to_storage
from app.services.openai_service import BadRequestError, use_dalle3
from app.settings import settings as env
from app.models.storage import File, FileSource
from app.dependencies import db_dependency, user_dependency
from app.responses import unauthorized_response

router = APIRouter(prefix='/openai', tags=['openai'])

# user uploads will be prefixed with `uploads/`
BUCKET_NAME = env.BASE_STORAGE_URL + os.environ.get('ENV', "development")

class DalleCompletionRequest(BaseModel):
    prompt: str

# Assuming db_dependency is a dependency that yields a session
@router.post("/generate-dalle3-completion", responses={401: unauthorized_response, 400: {"description": "Content policy violation"}})
async def generate_dalle3_completion(user: user_dependency, db: db_dependency, request: DalleCompletionRequest):
    try:
        b64_json = use_dalle3(request.prompt)
        id = str(uuid.uuid4())
        filename = f"dalle3/{id}.png"
        
        with db.begin():
            generation = File(
                uuid=id,
                bucket=BUCKET_NAME,
                name=filename,
                # Using the first 250 characters of the prompt as the human-readable name
                human_readable_name=request.prompt[:250],
                extension=".png",
                is_public=True,
                is_uploaded=True,
                user_email=user["email"],
                content_type="image",
                source=FileSource.system_generated,
            )
            db.add(generation)

            image_data = base64.b64decode(b64_json)
            image_file = io.BytesIO(image_data)
            
            success = upload_file_to_storage(image_file, BUCKET_NAME, filename=filename)
            if not success:
                db.rollback()
                raise ValueError("Failed to upload image to storage")

    except BadRequestError as e:
        # mapping third-party error to our own error
        if e.code == "content_policy_violation":
            raise HTTPException(status_code=400, detail="Content policy violation")
    except SQLAlchemyError as e:
        logging.error(f"Database error: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

    return {"message": "DALL-E 3 completion generated."}

