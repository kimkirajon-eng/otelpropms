from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os

# 1. VERİTABANI AYARLARI
# Render üzerindeki DATABASE_URL değişkenini çeker
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. ODA MODELİ (TABLO YAPISI)
class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String, unique=True, index=True)
    room_type = Column(String)
    price = Column(Float)
    current_status = Column(String, default="Temiz")
    guest_name = Column(String, nullable=True)

# TABLOLARI OTOMATİK OLUŞTUR (Açılışta kontrol eder, yoksa kurar)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Reservation Service")

# Veritabanı Oturumu Yönetimi
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 3. YOLLAR (ENDPOINTS)

@app.get("/health")
async def health():
    return {"status": "up", "database": "connected"}

@app.get("/rooms")
def list_rooms(db: Session = Depends(get_db)):
    """Veritabanındaki tüm odaları çeker"""
    rooms = db.query(Room).all()
    return rooms

@app.post("/rooms")
def create_room(room_data: dict, db: Session = Depends(get_db)):
    """Yeni odayı veritabanına kalıcı olarak kaydeder"""
    try:
        new_room = Room(
            room_number=str(room_data["room_number"]),
            room_type=room_data["room_type"],
            price=float(room_data["price"]),
            current_status=room_data.get("current_status", "Temiz")
        )
        db.add(new_room)
        db.commit() # VERİYİ MÜHÜRLE
        db.refresh(new_room)
        return new_room
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Hata: {str(e)}")

@app.post("/reservations/create")
def create_booking(data: dict, db: Session = Depends(get_db)):
    # Rezervasyon mantığı buraya eklenecek
    return {"status": "success", "message": "Rezervasyon özelliği yakında!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)
