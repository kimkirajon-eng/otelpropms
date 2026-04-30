from fastapi import FastAPI
from .models import Reservation
from shared.utils import MessageBus # Daha önce yazdığımız ortak kütüphane

app = FastAPI()
bus = MessageBus()

@app.post("/reservations/create")
async def create_booking(data: dict):
    # 1. Veritabanına kaydet (Özet geçildi)
    new_res_id = 101 
    
    # 2. GERÇEK ZAMANLI HABERLEŞME: Finans servisine haber ver
    event_data = {
        "event": "RESERVATION_CREATED",
        "reservation_id": new_res_id,
        "guest_name": data["guest_name"],
        "total_amount": data["amount"]
    }
    bus.publish("finance_events", event_data)
    
    return {"status": "Rezervasyon alındı, finans birimine iletildi.", "id": new_res_id}
