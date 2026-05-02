import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from pydantic import BaseModel

app = FastAPI(title="Reservation Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
)

# Model
class RoomRequest(BaseModel):
    room_number: str
    room_type: str
    price: int
    current_status: str

# ===== ROUTES =====

@app.get("/")
async def root():
    return {"message": "Reservation Service Çalışıyor"}

# Tüm Odaları Getir
@app.get("/rooms")
@app.get("/res/rooms")
async def get_rooms():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM rooms ORDER BY room_number"))
            rooms = [dict(row._mapping) for row in result]
            return rooms
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Yeni Oda Ekle
@app.post("/rooms")
@app.post("/res/rooms")
async def create_room(room: RoomRequest):
    try:
        with engine.connect() as conn:
            query = text("""
                INSERT INTO rooms (room_number, room_type, price, current_status)
                VALUES (:room_number, :room_type, :price, :current_status)
                RETURNING *
            """)
            result = conn.execute(query, {
                "room_number": room.room_number,
                "room_type": room.room_type,
                "price": room.price,
                "current_status": room.current_status
            })
            conn.commit()
            new_room = dict(result.first()._mapping)
            return new_room
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Tek Odayı Getir
@app.get("/rooms/{room_id}")
@app.get("/res/rooms/{room_id}")
async def get_room(room_id: int):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM rooms WHERE id = :id"), {"id": room_id})
            room = result.fetchone()
            if not room:
                raise HTTPException(status_code=404, detail="Oda bulunamadı")
            return dict(room._mapping)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
