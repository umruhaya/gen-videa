from fastapi import FastAPI, Request
from app.routers import auth
from app.dependencies import user_dependency, db_dependency
from app.models import User
from app.responses import unauthorized_response
app = FastAPI()

app.include_router(auth.router)

@app.get("/")
def root():
    return "Server is Up"

@app.get("/user-details", responses={409: unauthorized_response})
def user_details(user: user_dependency, db: db_dependency):
    return user
    

@app.api_route("/{full_path:path}", methods=["GET"])
async def catch_all(request: Request, full_path: str):
    return {"method": request.method, "path": full_path}