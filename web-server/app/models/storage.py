from sqlalchemy import Column, Integer, String, JSON, Text, ARRAY, Enum as SQLEnum, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class FileType(enum.Enum):
    image = 'image'
    video = 'video'
    audio = 'audio'
    document = 'document'

class FileSource(enum.Enum):
    user_upload = 'user_upload'
    system_generated = 'system_generated'

class File(Base):
    __tablename__ = 'file'

    uuid = Column(String(length=64), primary_key=True, nullable=False)
    bucket = Column(String(length=64), nullable=False)
    name = Column(String(length=256), nullable=False)
    caption = Column(Text, nullable=True)
    human_readable_name = Column(String(length=256), default='')
    extension = Column(String(length=16), nullable=False)
    is_public = Column(Boolean, default=False, nullable=False)
    is_uploaded = Column(Boolean, default=False, nullable=False)
    user_email = Column(String(length=256), ForeignKey('auth_user.email'), nullable=False)
    content_type = Column(SQLEnum(FileType), nullable=False)
    source = Column(SQLEnum(FileSource), nullable=False)

    # This will enable you to access the user directly from a File instance
    user = relationship("User", back_populates="files")

    # Many-to-many relationship with Completion
    completions = relationship("Completion", secondary='completion_file_link', back_populates="files")    