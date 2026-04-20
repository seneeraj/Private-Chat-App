from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import sqlite3
import bcrypt
import jwt
import datetime
import shutil

app = FastAPI()

SECRET_KEY = "supersecretkey"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ---------------- DB ----------------
def get_db():
    return sqlite3.connect("chat.db")

# ---------------- MODELS ----------------
class UserSignup(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Message(BaseModel):
    receiver_id: int
    encrypted_message: str

# ---------------- AUTH ----------------
def create_token(data: dict):
    return jwt.encode(
        {"exp": datetime.datetime.utcnow() + datetime.timedelta(hours=10), **data},
        SECRET_KEY,
        algorithm="HS256"
    )

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# ---------------- ROUTES ----------------

@app.post("/signup")
def signup(user: UserSignup):
    db = get_db()
    cursor = db.cursor()

    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())

    try:
        cursor.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            (user.username, user.email, hashed)
        )
        db.commit()
        return {"msg": "Signup successful. Wait for admin approval."}
    except:
        raise HTTPException(status_code=400, detail="User exists")


@app.post("/login")
def login(user: UserLogin):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT id, password_hash, approval_status FROM users WHERE username=?", (user.username,))
    data = cursor.fetchone()

    if not data:
        raise HTTPException(status_code=404, detail="User not found")

    user_id, password_hash, status = data

    if status != "ACTIVE":
        raise HTTPException(status_code=403, detail="Not approved yet")

    if not bcrypt.checkpw(user.password.encode(), password_hash):
        raise HTTPException(status_code=401, detail="Wrong password")

    token = create_token({"user_id": user_id})
    return {"access_token": token}


@app.get("/admin/pending")
def get_pending_users(current=Depends(get_current_user)):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM users WHERE approval_status='PENDING'")
    return cursor.fetchall()


@app.post("/admin/approve/{user_id}")
def approve_user(user_id: int, current=Depends(get_current_user)):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("UPDATE users SET approval_status='ACTIVE' WHERE id=?", (user_id,))
    db.commit()

    return {"msg": "User approved"}


@app.post("/send-message")
def send_message(msg: Message, current=Depends(get_current_user)):
    db = get_db()
    cursor = db.cursor()

    sender_id = current["user_id"]

    cursor.execute(
        "INSERT INTO messages (sender_id, receiver_id, encrypted_message) VALUES (?, ?, ?)",
        (sender_id, msg.receiver_id, msg.encrypted_message)
    )
    db.commit()

    return {"msg": "Message sent (encrypted)"}


@app.post("/upload-file")
def upload_file(file: UploadFile = File(...), current=Depends(get_current_user)):
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"file_url": file_path}