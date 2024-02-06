from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .settings import settings as env
from sqlalchemy.orm import declarative_base

Base = declarative_base()

engine = create_engine(
    f'postgresql+psycopg2://{env.DB_USER}:{env.DB_PASS}@{env.DB_HOST}:{env.DB_PORT}/{env.DB_NAME}'
)

def get_db():
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        yield session
    finally:
        session.close()