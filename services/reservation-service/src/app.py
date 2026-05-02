from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os

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
    current_status = Column(String, default="Temiz") # Temiz, Dolu, Kirli
    guest_name = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)
app = FastAPI()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@app.get("/rooms")
def list_rooms(db: Session = Depends(get_db)):
    rooms = db.query(Room).all()
    return [{
        "id": r.id, "room_number": r.room_number, "room_type": r.room_type,
        "price": r.price, "current_status": r.current_status, "guest_name": r.guest_name
    } for r in rooms]

@app.post("/rooms")
def create_room(data: dict, db: Session = Depends(get_db)):
    new_room = Room(room_number=str(data["room_number"]), room_type=data["room_type"], price=float(data["price"]))
    db.add(new_room); db.commit(); return {"status": "success"}

# --- YENİ: CHECK-IN İŞLEMİ ---
@app.post("/rooms/{room_id}/checkin")
def check_in(room_id: int, data: dict, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room: raise HTTPException(status_code=404)
    room.guest_name = data["guest_name"]
    room.current_status = "Dolu"
    db.commit()
    return {"message": "Giriş yapıldı"}

# --- YENİ: CHECK-OUT (HOUSEKEEPING'E BAĞLI) ---
@app.post("/rooms/{room_id}/checkout")
def check_out(room_id: int, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    room.guest_name = None
    room.current_status = "Kirli" # Çıkış yapan oda temizlenmeli
    db.commit()
    return {"message": "Çıkış yapıldı, oda kirli"}

# --- YENİ: TEMİZLİK BİTTİ ---
@app.post("/rooms/{room_id}/cleaned")
def set_cleaned(room_id: int, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    room.current_status = "Temiz"
    db.commit()
    return {"message": "Oda temizlendi"}

@app.get("/reset-db")
def reset_db():
    Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine)
    return {"message": "Sifirlandi"}
