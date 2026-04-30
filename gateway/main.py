import uvicorn
from fastapi import FastAPI, Request
import httpx
import os

app = FastAPI(title="Hotel PMS Gateway")

# Servis URL'leri Render ortam değişkenlerinden gelir
SERVICES = {
    "auth": os.getenv("IDENTITY_SERVICE_URL"),
    "res": os.getenv("RESERVATION_SERVICE_URL"),
    "hk": os.getenv("HK_SERVICE_URL"),
    "pos": os.getenv("POS_SERVICE_URL")
}

@app.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def gateway_proxy(service: str, path: str, request: Request):
    if service not in SERVICES:
        return {"error": "Servis bulunamadı"}, 404
    
    target_url = f"{SERVICES[service]}/{path}"
    
    async with httpx.AsyncClient() as client:
        content = await request.body()
        resp = await client.request(
            method=request.method,
            url=target_url,
            content=content,
            headers=dict(request.headers),
            params=dict(request.query_params)
        )
        return resp.json()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
