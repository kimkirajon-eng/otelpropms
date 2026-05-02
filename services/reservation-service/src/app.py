from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String, unique=True, index=True)
    room_type = Column(String)
    price = Column(Float)
    current_status = Column(String, default="Temiz")
    guest_name = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/rooms")
def list_rooms(db: Session = Depends(get_db)):
    rooms = db.query(Room).all()
    # VERİ TEMİZLEME: Nesneleri düz JSON formatına çeviriyoruz
    result = []
    for r in rooms:
        result.append({
            "id": r.id,
            "room_number": r.room_number,
            "room_type": r.room_type,
            "price": r.price,
            "current_status": r.current_status,
            "guest_name": r.guest_name
        })
    return result

@app.post("/rooms")
def create_room(room_data: dict, db: Session = Depends(get_db)):
    try:
        new_room = Room(
            room_number=str(room_data["room_number"]),
            room_type=room_data["room_type"],
            price=float(room_data["price"]),
            current_status=room_data.get("current_status", "Temiz")
        )
        db.add(new_room)
        db.commit()
        db.refresh(new_room)
        return {"status": "success", "id": new_room.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/health")
def health():
    return {"status": "up"}
