from fastapi import FastAPI
from shared.utils import MessageBus
from shared.schemas import TransactionRequest

app = FastAPI()
bus = MessageBus()

@app.post("/pos/sale")
async def create_sale(sale: TransactionRequest):
    # Harcamayı finans servisine gerçek zamanlı gönder
    event_data = {
        "event": "NEW_TRANSACTION",
        "data": sale.dict()
    }
    bus.publish("finance_events", event_data)
    return {"status": "Satış işlendi ve Folio'ya gönderildi"}
