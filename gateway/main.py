import os
import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

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
    if service_name not in SERVICES or not SERVICES[service_name]:
        return Response(content='{"error": "Servis bulunamadi"}', status_code=404)

    target_url = f"{SERVICES[service_name]}/{rest_of_path}"
    body = await request.body()
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                method=request.method,
                url=target_url,
                params=request.query_params,
                content=body,
                headers={k: v for k, v in request.headers.items() if k.lower() != "host"},
                timeout=20.0
            )
            # EN GARANTİ SATIR: Veriyi asla .json() yapma, direkt "binary" içeriği dön
            return Response(
                content=response.content, 
                status_code=response.status_code, 
                media_type=response.headers.get("content-type")
            )
        except Exception as e:
            return Response(content=f'{{"error": "{str(e)}"}}', status_code=500)
