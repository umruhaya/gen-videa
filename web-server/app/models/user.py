from sqlalchemy import Column, Integer, String, JSON, Text, ARRAY, Enum, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = 'auth_user'

    email = Column(String(length=64), primary_key=True, nullable=False)
    username = Column(String(length=64), unique=True, nullable=False)
    password = Column(String(length=128), nullable=False)
    bio = Column(String(length=512), nullable=True)
    profile_picture = Column(String(length=128), nullable=True)

    # Relationship with Completion model
    completions = relationship("Completion", back_populates="user", cascade="all, delete-orphan")

    # Relationship with File model
    files = relationship("File", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(username={self.username} email={self.email})>"