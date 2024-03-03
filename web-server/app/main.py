from fastapi import FastAPI, Request
from app.routers import auth, webhook, files
from app.dependencies import user_dependency, db_dependency
from app.models import User
from app.responses import unauthorized_response
from app.services.auth_service import get_db_user_from_token
app = FastAPI()

app.include_router(auth.router)
app.include_router(webhook.router)
app.include_router(files.router)

@app.get("/")
async def root():
    return "Server is Up"

@app.get("/user-details", responses={409: unauthorized_response})
async def user_details(user: user_dependency, db: db_dependency):
    return get_db_user_from_token(user["email"], db)
    

@app.api_route("/{full_path:path}", methods=["GET"])
async def catch_all(request: Request, full_path: str):
    return {"method": request.method, "path": full_path}