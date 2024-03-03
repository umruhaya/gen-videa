from openai import OpenAI
import cv2
import base64
from io import BytesIO
from app.schemas.openai_schema import TTSVOICEMODEL

client = OpenAI()

def use_gpt4_vision(video) -> str:
    base64Frames = []
    while video.isOpened():
        success, frame = video.read()
        if not success:
            break
        _, buffer = cv2.imencode(".jpg", frame)
        base64Frames.append(base64.b64encode(buffer).decode("utf-8"))

    video.release()

    every_n_frames = base64Frames[0::50]

    PROMPT_MESSAGES = [
        {
            "role": "user",
            "content": [
                "These are frames from a video that I want to upload. Generate a compelling description that I can upload along with the video.",
                *map(lambda x: {"image": x, "resize": 768}, every_n_frames),
            ],
        },
    ]
    params = {
        "model": "gpt-4-vision-preview",
        "messages": PROMPT_MESSAGES,
        "max_tokens": 200,
    }

    result = client.chat.completions.create(**params)
    return result.choices[0].message.content

def use_tts(text, voice_model: TTSVOICEMODEL) -> str:

    response = client.audio.speech.create(
        model="tts-1",
        voice=voice_model,
        input=text
    )
