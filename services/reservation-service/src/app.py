from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse # ÖNEMLİ: Manuel JSON yanıtı için
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
import json

# 1. DB AYARLARI
DATABASE_URL = os.getenv("DATABASE_URL", "").replace("postgres://", "postgresql://", 1)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String, unique=True)
    room_type = Column(String)
    price = Column(Float)
    current_status = Column(String, default="Temiz")

Base.metadata.create_all(bind=engine)
app = FastAPI()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

# 2. ODALARI LİSTELEME (HATASIZ JSON GARANTİSİ)
@app.get("/rooms")
def list_rooms(db: Session = Depends(get_db)):
    rooms_from_db = db.query(Room).all()
    
    # SQLAlchemy nesnelerini ham veri sözlüğüne çevir (Binary hatasını önler)
    clean_data = []
    for r in rooms_from_db:
        clean_data.append({
            "id": int(r.id),
            "room_number": str(r.room_number),
            "room_type": str(r.room_type),
            "price": float(r.price),
            "current_status": str(r.current_status)
        })
    
    # VERİYİ MANUEL OLARAK JSON FORMATINDA DÖNÜYORUZ (B hatasını KESİN çözer)
    return JSONResponse(content=clean_data)

@app.post("/rooms")
def create_room(data: dict, db: Session = Depends(get_db)):
    try:
        new_room = Room(
            room_number=str(data["room_number"]),
            room_type=str(data["room_type"]),
            price=float(data["price"])
        )
        db.add(new_room)
        db.commit()
        return JSONResponse(content={"status": "success"})
    except Exception as e:
        db.rollback()
        return JSONResponse(content={"error": str(e)}, status_code=400)

@app.get("/health")
def health():
    return {"status": "up"}
