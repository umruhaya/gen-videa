import io
import base64
import uuid
import os
import logging
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import StreamingResponse
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
from app.services.storage_service import upload_file_to_storage, download_file_from_storage, generate_get_presigned_url
from app.services.openai_service import BadRequestError, use_dalle3, use_gpt4_vision_image, use_gpt4_vision_video
from app.settings import settings as env
from app.models.storage import File, FileSource, FileType
from app.dependencies import db_dependency, user_dependency
from app.responses import unauthorized_response, not_found_response, conflict_response

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

class GenerateCaptionRequest(BaseModel):
    file_id: str

class GenerateCaptionResponse(BaseModel):
    message: str

@router.post("/generate-caption", responses={401: unauthorized_response, 404: not_found_response, 409: conflict_response})
async def generate_caption(user: user_dependency, db: db_dependency, request: GenerateCaptionRequest):
    # Attempt to fetch the file with the given ID and user's email
    file = db.query(File).filter(File.uuid == request.file_id, File.user_email == user["email"]).first()
    
    # Check if the file exists
    if not file:
        # If the file does not exist, return a 404 Not Found response
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found.")
    
    # if file.caption is not None:
    #     raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Caption already exists.")

    # If the file exists, generate a caption for it
    is_video = file.content_type == FileType.video

    if is_video:
        # download the file from storage
        video = download_file_from_storage(file.bucket, file.name)
        completion_stream = await use_gpt4_vision_video(video)
    else:
        # generate a url if the file is an image
        url = generate_get_presigned_url(file.bucket, file.name)
        completion_stream = await use_gpt4_vision_image(url)

    async def streamer():
        completion = ""
        try:
            for chunk in completion_stream:
                token = chunk.choices[0].delta.content
                if token is not None:
                    completion += token
                    yield f"data: {token}\n\n"
        finally:
            print(f"Caption Generated:\n\n{completion}")

    return StreamingResponse(streamer(), media_type="text/event-stream")