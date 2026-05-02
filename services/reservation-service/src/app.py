from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os

# 1. DB AYARLARI
DATABASE_URL = os.getenv("DATABASE_URL", "").replace("postgres://", "postgresql://", 1)
engine = create_engine(DATABASE_URL)

# KRİTİK AYAR: expire_on_commit=False (Verilerin vadesinin dolmasını önler)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, expire_on_commit=False)
Base = declarative_base()

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String, unique=True)
    room_type = Column(String)
    price = Column(Float)
    current_status = Column(String, default="Temiz")
    guest_name = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)
app = FastAPI()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

# 2. YOLLAR
@app.get("/rooms")
def list_rooms(db: Session = Depends(get_db)):
    rooms = db.query(Room).all()
    # Veriyi elle sözlüğe çevirerek hata payını sıfırlıyoruz
    return [{
        "id": r.id, 
        "room_number": r.room_number, 
        "room_type": r.room_type,
        "price": r.price, 
        "current_status": r.current_status, 
        "guest_name": r.guest_name
    } for r in rooms]

@app.post("/rooms")
def create_room(data: dict, db: Session = Depends(get_db)):
    try:
        new_room = Room(
            room_number=str(data["room_number"]), 
            room_type=data["room_type"], 
            price=float(data["price"])
        )
        db.add(new_room)
        db.commit()
        return {"status": "success"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/reset-db")
def reset_db():
    Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine)
    return {"message": "Sifirlandi"}
