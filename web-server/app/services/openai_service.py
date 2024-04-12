from openai import OpenAI, BadRequestError
import base64
import cv2
import os
import numpy as np
import tempfile

client = OpenAI()

async def use_gpt4_vision_video(video_bytes):
    """
    Args:
        video_bytes (BytesIO): BytesIO object containing video data
    """
    frames = []

    FRAME_STEP = 50

    # Convert BytesIO to bytes
    video_data = video_bytes.read()

    # Create a temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')

    # Write the video data to the temporary file
    temp_file.write(video_data)
    temp_file.close()

    # Use OpenCV to decode the video
    video = cv2.VideoCapture(temp_file.name)

    # # Convert bytes data to numpy array
    # video_array = np.frombuffer(video_data, np.uint8)

    # # Use OpenCV to decode the video
    # video = cv2.VideoCapture(cv2.imdecode(video_array, cv2.IMREAD_COLOR))

    frames = []
    FRAME_STEP = 50
    frames_read = 0

    while True:
        success, frame = video.read()
        if not success:
            break
        if frames_read % FRAME_STEP == 0:
            _, buffer = cv2.imencode(".jpg", frame)
            frames.append(base64.b64encode(buffer).decode("utf-8"))
        frames_read += 1

    video.release()

    os.unlink(temp_file.name)

    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "These are frames from a video. Generate a compelling description for the video."},
                *map(lambda x: {"image": x, "resize": 768}, frames),
            ],
        },
    ]
    print(len(messages[0]["content"]))
    params = {
        "model": "gpt-4-turbo",
        "messages": messages,
        "max_tokens": 500,
        "stream": True,
    }
    return client.chat.completions.create(**params)
    

async def use_gpt4_vision_image(image_url):

    messages = [
        {
            "role": "user",
            "content": [
                "This is an image. Generate a compelling description for the image.",
                {"image_url": image_url},
            ],
        },
    ]
    params = {
        "model": "gpt-4-turbo",
        "messages": messages,
        "max_tokens": 500,
        "stream": True,
    }
    return client.chat.completions.create(**params)

def use_dalle3(prompt: str) -> str:

    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        n=1,
        response_format="b64_json",
    )

    b64_json = response.data[0].b64_json

    return b64_json