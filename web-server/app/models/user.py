from sqlalchemy import Column, Integer, String, JSON, Text, ARRAY, Enum, Boolean
from app.database import Base

class User(Base):
    __tablename__ = 'auth_user'

    email = Column(String(length=64), primary_key=True)
    username = Column(String(length=64))
    password = Column(String(length=128))
    flag = Column(Boolean, default=False)

    def __repr__(self):
        return f"<User(username={self.username} email={self.email}, password={self.password})>"