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
    user_upload = 'user-upload'
    system_generated = 'system-generated'

class File(Base):
    __tablename__ = 'file'

    uuid = Column(String(length=64), primary_key=True)
    bucket = Column(String(length=64))
    name = Column(String(length=256))
    human_readable_name = Column(String(length=256), default='')
    extension = Column(String(length=16))
    is_public = Column(Boolean, default=False)
    is_uploaded = Column(Boolean, default=False)
    user_email = Column(String(length=256), ForeignKey('auth_user.email'))
    content_type = Column(SQLEnum(FileType))
    source = Column(SQLEnum(FileSource))

    # This will enable you to access the user directly from a File instance
    user = relationship("User", back_populates="files")