from fastapi import FastAPI
from shared.utils import MessageBus

app = FastAPI()
bus = MessageBus()

@app.post("/hk/update-status")
async def update_room_status(room_id: int, status: str):
    # Oda durumunu güncelle (Dirty -> Clean vb.)
    # Ardından Resepsiyona (Reservation Service) bildirim gönderilebilir
    bus.publish("room_updates", {"room_id": room_id, "new_status": status})
    return {"message": f"Oda {room_id} durumu {status} olarak güncellendi."}
