import os
import httpx
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sadece servis linkleri kalsın, veritabanı bağlantısını SİL!
SERVICES = {
    "auth": os.getenv("IDENTITY_SERVICE_URL", "").rstrip('/'),
    "res": os.getenv("RESERVATION_SERVICE_URL", "").rstrip('/'),
    "hk": os.getenv("HK_SERVICE_URL", "").rstrip('/'),
    "finance": os.getenv("FINANCE_SERVICE_URL", "").rstrip('/')
}

@app.api_route("/{service_name}/{rest_of_path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
async def proxy(service_name: str, rest_of_path: str, request: Request):
    if service_name not in SERVICES or not SERVICES[service_name]:
        raise HTTPException(status_code=404, detail=f"Servis tanimsiz: {service_name}")

    target_url = f"{SERVICES[service_name]}/{rest_of_path}"
    
    async with httpx.AsyncClient() as client:
        try:
            body = await request.body()
            response = await client.request(
                method=request.method,
                url=target_url,
                params=request.query_params,
                content=body,
                headers={k: v for k, v in request.headers.items() if k.lower() != "host"},
                timeout=20.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
