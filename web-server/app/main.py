import asyncio
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from app.routers import auth, webhook, files, openai, profile, vision
from app.dependencies import user_dependency, db_dependency
from app.models import User
from app.responses import unauthorized_response
from app.services.auth_service import get_db_user_from_token

"""
# Graceful shutdown For Production Grade Server to handle ongoing requests with zero downtime

- The application will wait for a specific period to allow ongoing requests to complete before shutting down
- The application will reject new requests during shutdown
- The application will return 503 Service Unavailable status code during shutdown
- The `/readiness` endpoint checks if the application is ready to handle traffic. During the graceful shutdown period, this endpoint would return a 503 Service Unavailable status, indicating that the application should not receive new traffic.
- The `/liveness` endpoint checks if the application is running and not in a broken state. This endpoint could return a success status (e.g., 200 OK) as long as the application process is up and running, regardless of the graceful shutdown state.
"""

app_context = {
    "is_shutting_down": False
}

DEVELOPMENT_GRACEFUL_SHUTDOWN_PERIOD = 2
PRODUCTION_GRAFUL_SHUTDOWN_PERIOD = 240
GRACEFUL_SHUTDOWN_PERIOD = DEVELOPMENT_GRACEFUL_SHUTDOWN_PERIOD if os.getenv("ENV") is None else PRODUCTION_GRAFUL_SHUTDOWN_PERIOD

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    # For example, loading models, databases connections etc.
    print("Application startup")

    yield  # Yield control to the application until shutdown
    
    app_context["is_shutting_down"] = True
    print("Application shutdown started")

    # Wait for a the specific period to allow ongoing requests to complete
    await asyncio.sleep(GRACEFUL_SHUTDOWN_PERIOD)
    print("Application shutdown complete")

app = FastAPI(lifespan=lifespan)

app.include_router(auth.router)
app.include_router(webhook.router)
app.include_router(files.router)
app.include_router(openai.router)
app.include_router(profile.router)
app.include_router(vision.router)

@app.get("/")
async def root():
    return "Server is Up"

@app.get("/readiness")
async def readiness():
    # Indicates if the server is ready to handle requests
    if app_context["is_shutting_down"]:
        return Response(status_code=503, content={"detail": "Server is shutting down."}, media_type="application/json")
    return Response(status_code=200)

@app.get("/liveness")
async def liveness():
    # Indicates if the server is alive (may or may not be ready to handle requests)
    return Response(status_code=200)

@app.middleware("http")
async def check_shutdown_state(request, call_next):
    if app_context["is_shutting_down"]:
        # Optionally, reject new requests during shutdown
        return Response(status_code=503, content={"detail": "Server is shutting down."}, media_type="application/json")
    response = await call_next(request)
    return response

@app.get("/user-details", responses={409: unauthorized_response})
async def user_details(user: user_dependency, db: db_dependency):
    user_details = get_db_user_from_token(user["email"], db)
    return user_details

@app.api_route("/{full_path:path}", methods=["GET"])
async def catch_all(request: Request, full_path: str):
    return {"method": request.method, "path": full_path}