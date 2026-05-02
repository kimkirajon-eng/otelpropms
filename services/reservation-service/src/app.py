from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from shared.utils import MessageBus

app = FastAPI(title="Reservation Service")
bus = MessageBus()

# Veri Modelleri (Hata almamak için gerekli)
class RoomCreate(BaseModel):
    room_number: str
    room_type: str
    price: float
    current_status: str = "Temiz"

# SAHTE VERİTABANI (Şimdilik test için, ilerde DB'ye bağlanacak)
rooms_db = []

@app.get("/rooms")
async def get_rooms():
    """Tüm odaları listeler"""
    return rooms_db

@app.post("/rooms")
async def create_room(room: RoomCreate):
    """Yeni oda ekler"""
    new_room = {
        "id": len(rooms_db) + 1,
        **room.dict(),
        "guest_name": None
    }
    rooms_db.append(new_room)
    return new_room

@app.post("/reservations/create")
async def create_booking(data: dict):
    """Rezervasyon oluşturur ve Finans'a haber verir"""
    new_res_id = 101 + len(rooms_db)
    
    # GERÇEK ZAMANLI HABERLEŞME
    event_data = {
        "event": "RESERVATION_CREATED",
        "reservation_id": new_res_id,
        "guest_name": data.get("guest_name", "Bilinmiyor"),
        "total_amount": data.get("amount", 0)
    }
    bus.publish("finance_events", event_data)
    
    return {"status": "Rezervasyon alındı, finans birimine iletildi.", "id": new_res_id}

@app.get("/health")
async def health():
    return {"status": "up"}
