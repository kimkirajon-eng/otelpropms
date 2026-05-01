from fastapi import FastAPI, BackgroundTasks
from .worker import start_listening # Worker içindeki dinleme fonksiyonunu çağıracağız
import asyncio

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    # Uygulama başladığında worker'ı arka planda başlatır
    asyncio.create_task(start_listening())

@app.get("/health")
def health():
    return {"status": "finance-service is up and listening"}
