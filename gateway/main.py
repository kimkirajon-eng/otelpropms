import os
import httpx
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

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
    return {"status": "Gateway Aktif", "services": list(SERVICES.keys())}

@app.api_route("/{service_name}/{rest_of_path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
async def proxy(service_name: str, rest_of_path: str, request: Request):
    if service_name not in SERVICES or not SERVICES[service_name]:
        raise HTTPException(status_code=404, detail="Servis tanimsiz")

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
                timeout=30.0
            )
            
            # GÜVENLİ DECODE: Veri bozuksa bile hata vermeden işle
            try:
                return response.json()
            except:
                return {"message": "Veri okunamadi", "raw_content": str(response.content)}

        except Exception as e:
            return {"error": "Baglanti Hatasi", "detay": str(e), "url": target_url}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
