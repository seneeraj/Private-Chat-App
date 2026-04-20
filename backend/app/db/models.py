from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from datetime import datetime
from .database import Base


role = Column(String, default="USER")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password_hash = Column(String)
    public_key = Column(Text)
    approval_status = Column(String, default="PENDING")
    role = Column(String, default="USER")
    created_at = Column(DateTime, default=datetime.utcnow)


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer)
    encrypted_message = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    file_url = Column(String, nullable=True)
    file_type = Column(String, nullable=True)  # image / pdf
    
# ---------------- GROUP ----------------
class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)


# ---------------- GROUP MEMBERS ----------------
class GroupMember(Base):
    __tablename__ = "group_members"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer)
    user_id = Column(Integer)
    role = Column(String, default="MEMBER")  # ADMIN / MEMBER


# ---------------- GROUP MESSAGE ----------------
class GroupMessage(Base):
    __tablename__ = "group_messages"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer)
    sender_id = Column(Integer)
    message = Column(String)    