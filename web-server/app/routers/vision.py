import logging
import mimetypes
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.storage_service import upload_file_to_storage, download_file_from_storage, generate_get_presigned_url
from app.services.gemini_service import use_gemini, GeminiRequest, GeminiMediaPart
from app.settings import settings as env
from app.models import File, Completion, CompletionFileLink
from app.dependencies import db_dependency, user_dependency
from app.responses import unauthorized_response, bad_request_response

router = APIRouter(prefix='/vision', tags=['vision'])

class MultimodalCompletionRequest(BaseModel):
    file_ids: list[str]
    prompt: str

MAX_ALLOWED_LENGTH = 5

@router.post("/generate-multimodal-response", responses={401: unauthorized_response, 400: bad_request_response})
def generate_multimodal_completion(_: user_dependency, db: db_dependency, request: MultimodalCompletionRequest):
    """
    max allowed length of file_ids is 5
    """
    files = db.query(File).filter(File.uuid.in_(request.file_ids)).all()
    print(len(files))
    if len(files) > MAX_ALLOWED_LENGTH:
        raise HTTPException(status_code=400, detail="Too many files")
    
    try:
        gemini_request = GeminiRequest(
            files=[GeminiMediaPart(
                mime_type=mimetypes.guess_type(file.name)[0],
                uri=f"gs://{file.bucket}/{file.name}",
            ) for file in files],
            prompt=request.prompt,
        )
    except Exception as e:
        logging.error("Error creating Gemini request: %s", e, extra={"request": request.model_dump_json()})
        raise HTTPException(status_code=400, detail="Bad request")

    def streamer():
        completion = ""
        stream = use_gemini(gemini_request)
        for chunk in stream:
            token = chunk.text
            if token is not None and token != "":
                completion += token
                yield f"data:{token}\n\n"

        logging.info("Gemini completion: %s", completion)

    return StreamingResponse(streamer(), media_type="text/event-stream")

class MultimodalCompletionRequest(BaseModel):
    file_ids: list[str]
    category: str
    completion: str
    client_locale_time: str

@router.post("/create-mulitmodal-completion", responses={401: unauthorized_response, 400: bad_request_response})
def create_multimodal_completion(user: user_dependency, db: db_dependency, request: MultimodalCompletionRequest):
    files = db.query(File).filter(File.uuid.in_(request.file_ids)).all()
    if len(files) > MAX_ALLOWED_LENGTH:
        raise HTTPException(status_code=400, detail="Too many files")
    
    completion = Completion(
        user_email=user["email"],
        category=request.category,
        completion=request.completion,
        client_locale_time=request.client_locale_time,
    )
    db.add(completion)
    db.commit()

    for file in files:
        link = CompletionFileLink(completion_id=completion.id, file_id=file.id)
        db.add(link)
    
    db.commit()
    return Response(status_code=200, content="Multimodal completion created.", media_type="text/plain")