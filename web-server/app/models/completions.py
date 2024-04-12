from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Completion(Base):
    __tablename__ = 'completions'

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    user_email = Column(String(length=64), ForeignKey('auth_user.email'), nullable=False)
    category = Column(String(length=64), nullable=False)
    completion = Column(Text(), nullable=False)

    # Relationship to User
    user = relationship("User", back_populates="completions")

    # Many-to-many relationship with File
    files = relationship("File", secondary='completion_file_link', back_populates="completions")

# Association table for the many-to-many relationship between Completions and Files
class CompletionFileLink(Base):
    __tablename__ = 'completion_file_link'
    completion_id = Column(Integer, ForeignKey('completions.id'), primary_key=True)
    file_uuid = Column(String(length=64), ForeignKey('file.uuid'), primary_key=True)