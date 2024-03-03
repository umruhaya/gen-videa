from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from app.models import File
from app.dependencies import db_dependency
from pydantic import BaseModel
import base64
import json

from sqlalchemy.orm import Session

router = APIRouter(prefix='/webhook', tags=['webhook'])

class PubSubMessage(BaseModel):
    message: dict
    subscription: str

# user uploads will be prefixed with `uploads/`

@router.post("/file-uploaded")
async def file_uploaded_webhook(request: Request, db: db_dependency):
    # Parse the incoming request as JSON
    body = await request.json()
    db: Session = db
    # The structure of the body should match the expected Pub/Sub push format
    try:
        # Extract the actual message data
        message_data = body['message']['data']
        # Decode the message data from Base64
        decoded_message = base64.b64decode(message_data).decode('utf-8')
        json_message = json.loads(decoded_message)

        bucket = json_message['bucket']
        name = json_message['name']

        id = name.split('/')[-1].split('.')[0]

        print(f"File {name} uploaded to {bucket}.")
        print(json_message)

        # Update all entries where id matches target_id
        db.query(File).filter(File.id == id).update({"is_uploaded": True})
        db.commit()

        # Respond to indicate successful processing
        return {"success": True, "message": "Message processed successfully."}
    except KeyError as e:
        # If the expected keys aren't present, return an error response
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Missing key in payload: {e}")
