from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import SessionLocal, Room # Veritabanı bağlantıların

app = FastAPI()

# Veritabanı Oturumu
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/rooms")
async def create_room(room_data: dict, db: Session = Depends(get_db)):
    # 1. Yeni oda nesnesi oluştur
    new_room = Room(
        room_number=room_data["room_number"],
        room_type=room_data["room_type"],
        price=room_data["price"],
        current_status="Temiz"
    )
    # 2. VERİTABANINA KAYDET (KRİTİK ADIM)
    db.add(new_room)
    db.commit() # Bu satır veriyi kalıcı yapar
    db.refresh(new_room)
    return new_room

@app.get("/rooms")
async def get_rooms(db: Session = Depends(get_db)):
    return db.query(Room).all()
