from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from app.services.storage_service import generate_put_presigned_url, generate_get_presigned_url, delete_storage_blob
from app.settings import settings as env
from app.models.storage import File, FileSource
from app.models.user import User
from app.dependencies import db_dependency, user_dependency
from app.responses import unauthorized_response, not_found_response, bad_request_response, media_type_not_supported
from pydantic import BaseModel
from typing import List
import mimetypes
import uuid
import os
from sqlalchemy.orm import Session

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
    
class FileUrlResponse(BaseModel):
    url: str

@router.post("/create-file-upload-url", 
    responses={401: bad_request_response, 401: unauthorized_response, 415: media_type_not_supported}, 
    response_model=FileUrlResponse,
    description="Create a pre-signed URL for a file upload.\nAllowed file types: .jpg, .jpeg, .png, .gif, .mp4, .mov, .avi, .mkv",
)
async def create_file_upload_url(db: db_dependency, user: user_dependency, file: FileUploadRequest):

    mime_type, _ = mimetypes.guess_type(f'file{file.extension}')
    id = str(uuid.uuid4())
    name = "uploads/" + id + file.extension

    file_type = get_file_type(file.extension)

    if file_type is None:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
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

    return FileUrlResponse(url=url)

class FileInfo(BaseModel):
    uuid: str
    name: str
    extension: str
    content_type: str
    is_uploaded: bool
    is_public: bool
    url: str

@router.get("/list-user-uploads", 
    responses={401: unauthorized_response}, 
    description="List all files uploaded by the user."
)
async def list_user_uploads(db: db_dependency, user: user_dependency, public_only: bool = False, uploaded_only: bool = True) -> List[FileInfo]:
    db_files = db.query(File).filter(
        File.user_email == user["email"],
        File.source == FileSource.user_upload,
        File.is_uploaded == (True if uploaded_only else File.is_uploaded),
        File.is_public == (True if public_only else File.is_public),
    ).all()
    files = [FileInfo(
                uuid=file.uuid,
                name=file.human_readable_name,
                extension=file.extension,
                content_type=file.content_type,
                is_uploaded=file.is_uploaded,
                is_public=file.is_public,
                url=generate_get_presigned_url(file.bucket, file.name),
            ) for file in db_files]
    return files

@router.get("/list-system-generations", 
    responses={401: unauthorized_response}, 
    description="List all generated files by the system/ai."
)
async def list_system_generations(db: db_dependency, user: user_dependency, public_only: bool = False) -> List[FileInfo]:
    db_files = db.query(File).filter(
        File.user_email == user["email"],
        File.source == FileSource.system_generated,
        File.is_public == (True if public_only else File.is_public),
    ).all()
    files = [FileInfo(
                uuid=file.uuid,
                name=file.human_readable_name,
                extension=file.extension,
                content_type=file.content_type,
                is_uploaded=file.is_uploaded,
                is_public=file.is_public,
                url=generate_get_presigned_url(file.bucket, file.name),
            ) for file in db_files]
    return files

class PublicFileInfo(FileInfo):
    username: str
    email: str

@router.get("/list-public-uploads", 
    responses={401: unauthorized_response}, 
    description="List all the public uploads by the users."
)
async def list_public_uploads(db: db_dependency, user: user_dependency, uploaded_only: bool = True) -> List[PublicFileInfo]:
    db_files = db.query(File, User).join(User, File.user_email == User.email).filter(
        File.source == FileSource.system_generated,
        File.is_uploaded == (True if uploaded_only else File.is_uploaded),
        File.is_public == True
    ).all()
    files = [PublicFileInfo(
                uuid=file.uuid,
                name=file.human_readable_name,
                extension=file.extension,
                content_type=file.content_type,
                is_uploaded=file.is_uploaded,
                is_public=file.is_public,
                url=generate_get_presigned_url(file.bucket, file.name),
                username=user.username,
                email=user.email,
            ) for file, user in db_files]
    return files

class FileVisibilityUpdateRequest(BaseModel):
    file_id: str
    is_public: bool

@router.patch("/update-file-visibility", responses={401: unauthorized_response, 404: not_found_response})
async def upload_visibility(db: db_dependency, user: user_dependency, file_request: FileVisibilityUpdateRequest) -> Response:
    file_id, is_public = file_request.file_id, file_request.is_public
   
    print(f"file_id: {file_id}, is_public: {is_public}")

    # Attempt to fetch the file with the given ID and user's email
    file = db.query(File).filter(File.uuid == file_id, File.user_email == user["email"]).first()
    
    # Check if the file exists
    if not file:
        # If the file does not exist, return a 404 Not Found response
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found.")
    
    # If the file exists, update its visibility
    file.is_public = is_public
    db.commit()
    
    # Return a success response
    return Response(status_code=status.HTTP_200_OK, content="Visibility updated.", media_type="text/plain")


@router.delete("/delete-file", responses={401: unauthorized_response, 404: not_found_response})
async def delete_file_from_storage(db: db_dependency, user: user_dependency, file_id: str):
    # Attempt to fetch the file with the given ID and user's email
    file = db.query(File).filter(File.uuid == file_id, File.user_email == user["email"]).first()
    
    # Check if the file exists
    if not file:
        # If the file does not exist, return a 404 Not Found response
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found.")
    
    # If the file exists, delete it
    db.delete(file)

    # Delete the file from the storage
    delete_storage_blob(file.bucket, file.name)

    db.commit()
    
    # Return a success response
    return Response(status_code=status.HTTP_200_OK, content="File deleted.", media_type="text/plain")