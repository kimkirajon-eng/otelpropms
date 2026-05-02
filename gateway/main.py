import os
import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

app = FastAPI(title="OtelPro API Gateway")

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

@app.get("/")
async def root():
    return {"status": "Gateway Live", "active_services": list(SERVICES.keys())}

@app.api_route("/{service_name}/{rest_of_path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
async def proxy(service_name: str, rest_of_path: str, request: Request):
    if service_name not in SERVICES or not SERVICES[service_name]:
        return Response(content='{"error": "Servis adresi eksik"}', status_code=404, media_type="application/json")

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
                timeout=30.0
            )
            
            # SÜPER TEMİZLEYİCİ: 
            # 1. decode("utf-8-sig") -> Görünmez ï»¿ (BOM) karakterlerini temizler.
            # 2. strip() -> Başındaki ve sonundaki tüm gizli boşlukları siler.
            try:
                clean_content = response.content.decode("utf-8-sig").strip()
            except:
                clean_content = response.text.strip()
            
            return Response(
                content=clean_content,
                status_code=response.status_code,
                media_type="application/json"
            )
        except Exception as e:
            return Response(content=f'{{"error": "Baglanti Hatasi", "detail": "{str(e)}"}}', status_code=500, media_type="application/json")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
