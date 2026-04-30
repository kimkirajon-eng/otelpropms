from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
import jwt # pyjwt
import datetime

app = FastAPI()

# Basit bir model
class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/auth/login")
def login(user: LoginRequest):
    # Gerçek projede veritabanı kontrolü yapılır
    if user.username == "admin" and user.password == "1234":
        token = jwt.encode({
            "sub": user.username,
            "role": "Admin",
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, "SECRET_KEY", algorithm="HS256")
        return {"access_token": token}
    raise HTTPException(status_code=401, detail="Hatalı giriş")

@app.get("/health")
def health():
    return {"status": "identity-service is up"}
