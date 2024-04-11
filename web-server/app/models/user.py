from sqlalchemy import Column, Integer, String, JSON, Text, ARRAY, Enum, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = 'auth_user'

    email = Column(String(length=64), primary_key=True)
    username = Column(String(length=64), unique=True)
    password = Column(String(length=128), nullable=False)
    profile_picture = Column(String(length=128), nullable=True)

    # relationship with File model
    files = relationship("File", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(username={self.username} email={self.email})>"