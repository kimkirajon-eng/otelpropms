from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os

# 1. DB BAĞLANTISI (Doğru formatlama)
DATABASE_URL = os.getenv("DATABASE_URL", "").replace("postgres://", "postgresql://", 1)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. MODEL (Sadece ihtiyacımız olan alanlar)
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
    try:
        yield db
    finally:
        db.close()

# 3. YOLLAR (Garantili Veri Dönüşü)
@app.get("/rooms")
def list_rooms(db: Session = Depends(get_db)):
    # Veritabanından ham veriyi çekiyoruz
    rooms_from_db = db.query(Room).all()
    
    # HATA ÖNLEYİCİ: SQLAlchemy nesnelerini elle düz sözlüğe çeviriyoruz
    # Böylece Pickle veya Binary karmaşası yaşanmaz
    clean_rooms = []
    for r in rooms_from_db:
        clean_rooms.append({
            "id": int(r.id),
            "room_number": str(r.room_number),
            "room_type": str(r.room_type),
            "price": float(r.price),
            "current_status": str(r.current_status)
        })
    return clean_rooms

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
        return {"status": "success"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/health")
def health():
    return {"status": "up"}
