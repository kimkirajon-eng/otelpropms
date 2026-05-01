import os
import httpx
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="OtelPro API Gateway")

# 1. CORS AYARI: Frontend'in (Arayüz) bağlanabilmesi için ŞART
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Güvenlik için daha sonra sadece kendi frontend linkini yazabilirsin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. SERVİS ADRESLERİ: Render Environment Variables'dan çekilir
# Eğer değişken yoksa varsayılan iç adresleri kullanır
SERVICES = {
    "auth": os.getenv("IDENTITY_SERVICE_URL", "http://identity-service:10000"),
    "res": os.getenv("RESERVATION_SERVICE_URL", "http://reservation-service:10000"),
    "hk": os.getenv("HK_SERVICE_URL", "http://housekeeping-service:10000"),
    "pos": os.getenv("POS_SERVICE_URL", "http://pos-service:10000"),
    "finance": os.getenv("FINANCE_SERVICE_URL", "http://finance-service:10000")
}

@app.get("/")
async def root():
    return {"message": "OtelPro API Gateway Aktif", "services": list(SERVICES.keys())}

# 3. DİNAMİK YÖNLENDİRİCİ: Gelen tüm istekleri ilgili servise iletir
@app.api_route("/{service_name}/{rest_of_path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy(service_name: str, rest_of_path: str, request: Request):
    if service_name not in SERVICES:
        raise HTTPException(status_code=404, detail="Servis bulunamadı")

    target_url = f"{SERVICES[service_name]}/{rest_of_path}"
    
    # Query parametrelerini al (örn: ?room_id=101)
    query_params = request.query_params
    
    # Body (veri) varsa al
    body = await request.body()
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                method=request.method,
                url=target_url,
                params=query_params,
                content=body,
                headers={k: v for k, v in request.headers.items() if k.lower() != "host"},
                timeout=10.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Servis bağlantı hatası: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Render'da çalışması için portu ortam değişkeninden alıyoruz
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
