import os
import dotenv
from pydantic_settings import BaseSettings

dotenv.load_dotenv()

class Setting(BaseSettings):
    # Database
    DB_USER: str
    DB_PASS: str
    DB_NAME: str
    DB_HOST: str
    DB_PORT: int

    # Authentication
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_HOURS: int

    class Config:
        env_file = ".env"

settings = Setting()