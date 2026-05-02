import os
import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVICES = {
    "auth": os.getenv("IDENTITY_SERVICE_URL", "").rstrip('/'),
    "res": os.getenv("RESERVATION_SERVICE_URL", "").rstrip('/'),
    "hk": os.getenv("HK_SERVICE_URL", "").rstrip('/'),
    "finance": os.getenv("FINANCE_SERVICE_URL", "").rstrip('/')
}

@app.api_route("/{service_name}/{rest_of_path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
async def proxy(service_name: str, rest_of_path: str, request: Request):
    if service_name not in SERVICES: return {"error": "Servis yok"}
    
    target_url = f"{SERVICES[service_name]}/{rest_of_path}"
    body = await request.body()
    
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=target_url,
            params=request.query_params,
            content=body,
            headers={k: v for k, v in request.headers.items() if k.lower() != "host"},
            timeout=10.0
        )
        # EN GARANTİ SATIR: Veriyi işleme, direkt yanıtı dön
        from fastapi.responses import Response
        return Response(content=response.content, status_code=response.status_code, media_type=response.headers.get("content-type"))
