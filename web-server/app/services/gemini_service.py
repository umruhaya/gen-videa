import vertexai
from pydantic import BaseModel
from typing import Literal
from vertexai.generative_models import GenerativeModel, Part
import vertexai.preview.generative_models as generative_models

safety_settings = {
    generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}

"""
Allowed Formats for Gemini API:
    Image: PNG or JPG format.
    Video: MKV, MOV, MP4 or WEBM format.
    Document: PDF format.
    Audio: MP3 or MP4 format. 
"""

class GeminiMediaPart(BaseModel):
    mime_type: Literal["video/mp4", "video/webm", "video/mkv", "video/mov", "image/jpeg", "image/png", "application/pdf", "audio/mp3", "audio/mp4"]
    uri: str

class GeminiRequest(BaseModel):
    files: list[GeminiMediaPart]
    prompt: str

def use_gemini(request: GeminiRequest):
    vertexai.init(project="jetrr-vision", location="us-central1")
    model = GenerativeModel("gemini-1.5-pro-preview-0409")
    media_files=[Part.from_uri(part.uri, part.mime_type) for part in request.files]
    text_prompt = request.prompt
    generation_config = {
        "max_output_tokens": 8192,
        "temperature": 0.8,
        "top_p": 0.95,
    }

    print([*media_files, text_prompt],
        generation_config,
        safety_settings)

    response_stream = model.generate_content(
        [*media_files, text_prompt],
        generation_config=generation_config,
        safety_settings=safety_settings,
        stream=True,
    )
    
    # Tokens can be accessed as `response.text for response in response_stream`
    return response_stream
    