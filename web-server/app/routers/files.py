from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from app.services.storage_service import generate_put_presigned_url
from app.settings import settings as env
from app.models import File
from app.settings import Setting
from app.dependencies import db_dependency, user_dependency
from pydantic import BaseModel
import mimetypes
import uuid
import os

router = APIRouter(prefix='/files', tags=['files'])

class FileUploadRequest(BaseModel):
    human_name: str
    extension: str

# user uploads will be prefixed with `uploads/`
BUCKET_NAME = env.BASE_STORAGE_URL + os.environ.get('ENV', "development")

def get_file_type(extension: str):
    if extension in ['.jpg', '.jpeg', '.png', '.gif']:
        return 'image'
    elif extension in ['.mp4', '.mov', '.avi', '.mkv']:
        return 'video'
    else:
        return None

@router.post("/create-file-upload-url")
def create_file_upload_url(db: db_dependency, user: user_dependency, file: FileUploadRequest):

    mime_type, _ = mimetypes.guess_type(f'file{file.extension}')
    id = str(uuid.uuid4())
    name = "uploads/" + id + file.extension

    file_type = get_file_type(file.extension)

    if file_type is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {mime_type} not supported"
        )

    file = File(
        uuid=id,
        bucket=BUCKET_NAME,
        name=name,
        human_readable_name=file.human_name,
        extension=file.extension,
        content_type=file_type,
        source='user_upload',
        user_email=user["email"],
    )

    db.add(file)
    db.commit()

    url = generate_put_presigned_url(BUCKET_NAME, name, mime_type)

    return url